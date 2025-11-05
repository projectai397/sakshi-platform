#!/usr/bin/env python3
"""
Personalized Product Recommendation Engine
Uses collaborative filtering + content-based filtering
"""

import sys
import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
from collections import defaultdict
import warnings
warnings.filterwarnings('ignore')

class RecommendationEngine:
    def __init__(self):
        self.user_item_matrix = None
        self.item_features_matrix = None
        self.svd_model = None
        self.user_ids = []
        self.item_ids = []
        
    def build_user_item_matrix(self, interactions):
        """
        Build user-item interaction matrix from purchase/view data
        
        Args:
            interactions: List of {userId, productId, score} objects
        
        Returns:
            User-item matrix (numpy array)
        """
        # Get unique users and items
        users = sorted(set(i['userId'] for i in interactions))
        items = sorted(set(i['productId'] for i in interactions))
        
        self.user_ids = users
        self.item_ids = items
        
        # Create matrix
        matrix = np.zeros((len(users), len(items)))
        
        user_idx = {uid: idx for idx, uid in enumerate(users)}
        item_idx = {iid: idx for idx, iid in enumerate(items)}
        
        for interaction in interactions:
            u_idx = user_idx[interaction['userId']]
            i_idx = item_idx[interaction['productId']]
            matrix[u_idx, i_idx] = interaction['score']
        
        self.user_item_matrix = matrix
        return matrix
    
    def build_item_features_matrix(self, products):
        """
        Build item features matrix for content-based filtering
        
        Args:
            products: List of product objects with features
        
        Returns:
            Item features matrix
        """
        # Extract features: category, condition, price_range
        features = []
        
        for product in products:
            # One-hot encode category (simplified)
            category_features = [0] * 10
            if 'category' in product:
                cat_hash = hash(product['category']) % 10
                category_features[cat_hash] = 1
            
            # Encode condition (1-5 scale)
            condition_score = {
                'new': 5,
                'like-new': 4,
                'good': 3,
                'fair': 2,
                'poor': 1
            }.get(product.get('condition', 'good'), 3)
            
            # Normalize price (0-1 scale, assuming max 10000)
            price_norm = min(product.get('price', 0) / 10000, 1.0)
            
            # Combine features
            feature_vector = category_features + [condition_score / 5, price_norm]
            features.append(feature_vector)
        
        self.item_features_matrix = np.array(features)
        return self.item_features_matrix
    
    def train_collaborative_filtering(self, n_components=20):
        """
        Train collaborative filtering model using SVD
        
        Args:
            n_components: Number of latent factors
        """
        if self.user_item_matrix is None:
            raise ValueError("User-item matrix not built")
        
        # Use TruncatedSVD for matrix factorization
        n_comp = min(n_components, min(self.user_item_matrix.shape) - 1)
        self.svd_model = TruncatedSVD(n_components=n_comp, random_state=42)
        self.svd_model.fit(self.user_item_matrix)
        
        return self.svd_model
    
    def get_collaborative_recommendations(self, user_id, n_recommendations=10):
        """
        Get recommendations using collaborative filtering
        
        Args:
            user_id: User ID
            n_recommendations: Number of recommendations
        
        Returns:
            List of (product_id, score) tuples
        """
        if user_id not in self.user_ids:
            return []
        
        user_idx = self.user_ids.index(user_id)
        
        # Get user's latent factors
        user_vector = self.svd_model.transform(self.user_item_matrix[user_idx:user_idx+1])
        
        # Get all items' latent factors
        items_matrix = self.svd_model.transform(self.user_item_matrix.T)
        
        # Compute similarity
        similarities = cosine_similarity(user_vector, items_matrix)[0]
        
        # Get items user hasn't interacted with
        user_interactions = self.user_item_matrix[user_idx]
        uninteracted_items = np.where(user_interactions == 0)[0]
        
        # Get top recommendations
        recommendations = []
        for item_idx in uninteracted_items:
            recommendations.append((self.item_ids[item_idx], float(similarities[item_idx])))
        
        # Sort by score
        recommendations.sort(key=lambda x: x[1], reverse=True)
        
        return recommendations[:n_recommendations]
    
    def get_content_based_recommendations(self, product_id, n_recommendations=10):
        """
        Get similar products using content-based filtering
        
        Args:
            product_id: Product ID
            n_recommendations: Number of recommendations
        
        Returns:
            List of (product_id, similarity) tuples
        """
        if product_id not in self.item_ids:
            return []
        
        item_idx = self.item_ids.index(product_id)
        
        # Compute similarity with all items
        item_vector = self.item_features_matrix[item_idx:item_idx+1]
        similarities = cosine_similarity(item_vector, self.item_features_matrix)[0]
        
        # Get top similar items (excluding itself)
        similar_indices = np.argsort(similarities)[::-1][1:n_recommendations+1]
        
        recommendations = []
        for idx in similar_indices:
            recommendations.append((self.item_ids[idx], float(similarities[idx])))
        
        return recommendations
    
    def get_hybrid_recommendations(self, user_id, n_recommendations=10, cf_weight=0.7):
        """
        Get hybrid recommendations (collaborative + content-based)
        
        Args:
            user_id: User ID
            n_recommendations: Number of recommendations
            cf_weight: Weight for collaborative filtering (0-1)
        
        Returns:
            List of (product_id, score) tuples
        """
        # Get collaborative filtering recommendations
        cf_recs = self.get_collaborative_recommendations(user_id, n_recommendations * 2)
        
        # If user has no history, use popular items
        if not cf_recs:
            return self.get_popular_items(n_recommendations)
        
        # Get content-based recommendations for user's top items
        user_idx = self.user_ids.index(user_id) if user_id in self.user_ids else None
        if user_idx is not None:
            user_interactions = self.user_item_matrix[user_idx]
            top_items = np.argsort(user_interactions)[::-1][:3]
            
            cb_recs = []
            for item_idx in top_items:
                if user_interactions[item_idx] > 0:
                    item_id = self.item_ids[item_idx]
                    cb_recs.extend(self.get_content_based_recommendations(item_id, 5))
        else:
            cb_recs = []
        
        # Combine scores
        combined_scores = defaultdict(float)
        
        for product_id, score in cf_recs:
            combined_scores[product_id] += score * cf_weight
        
        for product_id, score in cb_recs:
            combined_scores[product_id] += score * (1 - cf_weight)
        
        # Sort and return top N
        recommendations = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
        return recommendations[:n_recommendations]
    
    def get_popular_items(self, n_recommendations=10):
        """
        Get most popular items (fallback for cold start)
        
        Returns:
            List of (product_id, popularity_score) tuples
        """
        if self.user_item_matrix is None:
            return []
        
        # Sum interactions for each item
        item_popularity = self.user_item_matrix.sum(axis=0)
        
        # Get top items
        top_indices = np.argsort(item_popularity)[::-1][:n_recommendations]
        
        recommendations = []
        for idx in top_indices:
            recommendations.append((self.item_ids[idx], float(item_popularity[idx])))
        
        return recommendations
    
    def get_similar_users(self, user_id, n_users=5):
        """
        Find similar users based on interaction patterns
        
        Args:
            user_id: User ID
            n_users: Number of similar users to return
        
        Returns:
            List of (user_id, similarity) tuples
        """
        if user_id not in self.user_ids:
            return []
        
        user_idx = self.user_ids.index(user_id)
        user_vector = self.user_item_matrix[user_idx:user_idx+1]
        
        # Compute similarity with all users
        similarities = cosine_similarity(user_vector, self.user_item_matrix)[0]
        
        # Get top similar users (excluding self)
        similar_indices = np.argsort(similarities)[::-1][1:n_users+1]
        
        similar_users = []
        for idx in similar_indices:
            similar_users.append((self.user_ids[idx], float(similarities[idx])))
        
        return similar_users

def main():
    """CLI interface"""
    try:
        if len(sys.argv) < 2:
            print(json.dumps({
                'success': False,
                'error': 'No command provided'
            }))
            sys.exit(1)
        
        command = sys.argv[1]
        engine = RecommendationEngine()
        
        if command == 'train':
            # Train model
            interactions = json.loads(sys.argv[2])
            products = json.loads(sys.argv[3])
            
            # Build matrices
            engine.build_user_item_matrix(interactions)
            engine.build_item_features_matrix(products)
            
            # Train collaborative filtering
            engine.train_collaborative_filtering()
            
            print(json.dumps({
                'success': True,
                'users': len(engine.user_ids),
                'items': len(engine.item_ids),
                'message': 'Model trained successfully'
            }))
            
        elif command == 'recommend':
            # Get recommendations
            interactions = json.loads(sys.argv[2])
            products = json.loads(sys.argv[3])
            user_id = int(sys.argv[4])
            n_recs = int(sys.argv[5]) if len(sys.argv) > 5 else 10
            
            # Build and train
            engine.build_user_item_matrix(interactions)
            engine.build_item_features_matrix(products)
            engine.train_collaborative_filtering()
            
            # Get recommendations
            recommendations = engine.get_hybrid_recommendations(user_id, n_recs)
            
            print(json.dumps({
                'success': True,
                'recommendations': recommendations
            }))
            
        elif command == 'similar_products':
            # Get similar products
            products = json.loads(sys.argv[2])
            product_id = int(sys.argv[3])
            n_recs = int(sys.argv[4]) if len(sys.argv) > 4 else 10
            
            # Build features matrix
            engine.item_ids = [p['id'] for p in products]
            engine.build_item_features_matrix(products)
            
            # Get similar products
            similar = engine.get_content_based_recommendations(product_id, n_recs)
            
            print(json.dumps({
                'success': True,
                'similar_products': similar
            }))
            
        elif command == 'popular':
            # Get popular items
            interactions = json.loads(sys.argv[2])
            n_recs = int(sys.argv[3]) if len(sys.argv) > 3 else 10
            
            engine.build_user_item_matrix(interactions)
            popular = engine.get_popular_items(n_recs)
            
            print(json.dumps({
                'success': True,
                'popular_items': popular
            }))
            
        else:
            print(json.dumps({
                'success': False,
                'error': f'Unknown command: {command}'
            }))
            sys.exit(1)
        
        sys.exit(0)
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)

if __name__ == '__main__':
    main()
