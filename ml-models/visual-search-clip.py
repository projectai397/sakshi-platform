#!/usr/bin/env python3
"""
Visual Search Service using OpenAI CLIP
Generates image embeddings and finds similar products
"""

import sys
import json
import torch
import numpy as np
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import os
import base64
from io import BytesIO

# Load CLIP model (using smaller ViT-B/32 for faster inference)
MODEL_NAME = "openai/clip-vit-base-patch32"
model = None
processor = None

def initialize_model():
    """Initialize CLIP model and processor"""
    global model, processor
    
    if model is None:
        try:
            print("Loading CLIP model...", file=sys.stderr)
            model = CLIPModel.from_pretrained(MODEL_NAME)
            processor = CLIPProcessor.from_pretrained(MODEL_NAME)
            model.eval()  # Set to evaluation mode
            print("CLIP model loaded successfully", file=sys.stderr)
        except Exception as e:
            print(f"Failed to load CLIP model: {e}", file=sys.stderr)
            raise

def encode_image(image_path_or_data):
    """
    Generate CLIP embedding for an image
    
    Args:
        image_path_or_data: Either file path or base64 encoded image data
    
    Returns:
        numpy array of image embedding (512 dimensions)
    """
    try:
        initialize_model()
        
        # Load image
        if image_path_or_data.startswith('data:image'):
            # Base64 encoded image
            image_data = image_path_or_data.split(',')[1]
            image_bytes = base64.b64decode(image_data)
            image = Image.open(BytesIO(image_bytes)).convert('RGB')
        else:
            # File path
            image = Image.open(image_path_or_data).convert('RGB')
        
        # Process image
        inputs = processor(images=image, return_tensors="pt")
        
        # Generate embedding
        with torch.no_grad():
            image_features = model.get_image_features(**inputs)
            # Normalize embedding
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        
        # Convert to numpy array
        embedding = image_features.cpu().numpy()[0]
        
        return embedding.tolist()
        
    except Exception as e:
        print(f"Error encoding image: {e}", file=sys.stderr)
        raise

def encode_text(text):
    """
    Generate CLIP embedding for text
    
    Args:
        text: Text description
    
    Returns:
        numpy array of text embedding (512 dimensions)
    """
    try:
        initialize_model()
        
        # Process text
        inputs = processor(text=[text], return_tensors="pt", padding=True)
        
        # Generate embedding
        with torch.no_grad():
            text_features = model.get_text_features(**inputs)
            # Normalize embedding
            text_features = text_features / text_features.norm(dim=-1, keepdim=True)
        
        # Convert to numpy array
        embedding = text_features.cpu().numpy()[0]
        
        return embedding.tolist()
        
    except Exception as e:
        print(f"Error encoding text: {e}", file=sys.stderr)
        raise

def compute_similarity(embedding1, embedding2):
    """
    Compute cosine similarity between two embeddings
    
    Args:
        embedding1: First embedding (list or numpy array)
        embedding2: Second embedding (list or numpy array)
    
    Returns:
        Similarity score (0-1, higher is more similar)
    """
    try:
        # Convert to numpy arrays
        emb1 = np.array(embedding1)
        emb2 = np.array(embedding2)
        
        # Compute cosine similarity
        similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
        
        return float(similarity)
        
    except Exception as e:
        print(f"Error computing similarity: {e}", file=sys.stderr)
        return 0.0

def find_similar_images(query_embedding, product_embeddings, top_k=10):
    """
    Find most similar products based on embeddings
    
    Args:
        query_embedding: Query image embedding
        product_embeddings: List of (product_id, embedding) tuples
        top_k: Number of results to return
    
    Returns:
        List of (product_id, similarity_score) tuples, sorted by similarity
    """
    try:
        query_emb = np.array(query_embedding)
        
        similarities = []
        for product_id, product_emb in product_embeddings:
            product_emb_array = np.array(product_emb)
            similarity = np.dot(query_emb, product_emb_array)
            similarities.append((product_id, float(similarity)))
        
        # Sort by similarity (descending)
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        return similarities[:top_k]
        
    except Exception as e:
        print(f"Error finding similar images: {e}", file=sys.stderr)
        return []

def batch_encode_images(image_paths):
    """
    Encode multiple images in batch for efficiency
    
    Args:
        image_paths: List of image file paths
    
    Returns:
        List of embeddings
    """
    try:
        initialize_model()
        
        images = []
        valid_paths = []
        
        for path in image_paths:
            try:
                img = Image.open(path).convert('RGB')
                images.append(img)
                valid_paths.append(path)
            except Exception as e:
                print(f"Failed to load image {path}: {e}", file=sys.stderr)
        
        if not images:
            return []
        
        # Process batch
        inputs = processor(images=images, return_tensors="pt")
        
        # Generate embeddings
        with torch.no_grad():
            image_features = model.get_image_features(**inputs)
            # Normalize embeddings
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        
        # Convert to list of embeddings
        embeddings = image_features.cpu().numpy()
        
        return [emb.tolist() for emb in embeddings]
        
    except Exception as e:
        print(f"Error in batch encoding: {e}", file=sys.stderr)
        return []

def main():
    """Main CLI interface"""
    try:
        if len(sys.argv) < 2:
            print(json.dumps({
                'success': False,
                'error': 'No command provided'
            }))
            sys.exit(1)
        
        command = sys.argv[1]
        
        if command == 'encode_image':
            if len(sys.argv) < 3:
                print(json.dumps({
                    'success': False,
                    'error': 'No image path provided'
                }))
                sys.exit(1)
            
            image_path = sys.argv[2]
            embedding = encode_image(image_path)
            
            print(json.dumps({
                'success': True,
                'embedding': embedding,
                'dimensions': len(embedding)
            }))
            
        elif command == 'encode_text':
            if len(sys.argv) < 3:
                print(json.dumps({
                    'success': False,
                    'error': 'No text provided'
                }))
                sys.exit(1)
            
            text = sys.argv[2]
            embedding = encode_text(text)
            
            print(json.dumps({
                'success': True,
                'embedding': embedding,
                'dimensions': len(embedding)
            }))
            
        elif command == 'find_similar':
            if len(sys.argv) < 4:
                print(json.dumps({
                    'success': False,
                    'error': 'Missing arguments'
                }))
                sys.exit(1)
            
            query_embedding = json.loads(sys.argv[2])
            product_embeddings = json.loads(sys.argv[3])
            top_k = int(sys.argv[4]) if len(sys.argv) > 4 else 10
            
            results = find_similar_images(query_embedding, product_embeddings, top_k)
            
            print(json.dumps({
                'success': True,
                'results': results
            }))
            
        elif command == 'batch_encode':
            if len(sys.argv) < 3:
                print(json.dumps({
                    'success': False,
                    'error': 'No image paths provided'
                }))
                sys.exit(1)
            
            image_paths = json.loads(sys.argv[2])
            embeddings = batch_encode_images(image_paths)
            
            print(json.dumps({
                'success': True,
                'embeddings': embeddings,
                'count': len(embeddings)
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
