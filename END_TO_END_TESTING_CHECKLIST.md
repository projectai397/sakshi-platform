# SAKSHI PLATFORM: END-TO-END TESTING CHECKLIST

**Date:** November 8, 2025  
**Version:** 1.0  
**Status:** Ready for Testing

---

## Testing Overview

This checklist covers all critical user flows and features of the Sakshi AI Platform. Each section should be tested thoroughly before production deployment.

---

## 1. User Authentication & Registration

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| Sign Up | Create new account with email | ⬜ | Test validation, password requirements |
| Login | Log in with existing credentials | ⬜ | Test remember me, error handling |
| Logout | Sign out successfully | ⬜ | Verify session cleared |
| Password Reset | Request and complete password reset | ⬜ | Test email delivery, token expiration |
| Social Login | Sign in with Google/Facebook | ⬜ | If implemented |

---

## 2. Product Browsing & Search

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| Homepage | Load homepage with featured items | ⬜ | Check performance, images load |
| Product Catalog | Browse all products | ⬜ | Test pagination, filters |
| Category Filter | Filter by category | ⬜ | Test all categories |
| Search | Search for products by keyword | ⬜ | Test relevance, no results |
| Visual Search | Upload image to find similar items | ⬜ | Test AI feature |
| Product Detail | View product details | ⬜ | Check all tabs, images, DPP |
| Age Filter | Filter children's items by age | ⬜ | Test all age ranges |

---

## 3. Triple Pricing System

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| View Prices | See all three pricing tiers | ⬜ | Community, Fair, Supporter |
| Select Price | Choose pricing tier | ⬜ | Test UI interaction |
| Community Price | Purchase at community price | ⬜ | No verification required |
| Fair Price | Purchase at fair price | ⬜ | Standard checkout |
| Supporter Price | Purchase at supporter price | ⬜ | Verify extra amount |
| Request Free | Submit free request form | ⬜ | Test form validation |

---

## 4. Shopping Cart & Checkout

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| Add to Cart | Add product to cart | ⬜ | Test quantity, variants |
| Update Cart | Change quantity or remove items | ⬜ | Test cart persistence |
| Cart Total | Verify price calculations | ⬜ | Test all pricing tiers |
| Checkout | Proceed to checkout | ⬜ | Test guest vs. logged in |
| Payment - Card | Pay with credit card | ⬜ | Test Stripe integration |
| Payment - PayPal | Pay with PayPal | ⬜ | Test PayPal flow |
| Payment - Tokens | Pay with Seva Tokens | ⬜ | Test balance check, deduction |
| Order Confirmation | Receive order confirmation | ⬜ | Test email, order page |

---

## 5. Seva Token System

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| View Balance | Check Seva Token balance | ⬜ | In dashboard |
| Earn - Meditation | Earn tokens through meditation | ⬜ | Test tracking, rewards |
| Earn - Volunteer | Earn tokens by volunteering | ⬜ | Test event attendance |
| Earn - Donation | Earn tokens from donations | ⬜ | Test approval workflow |
| Spend Tokens | Use tokens for purchase | ⬜ | Test deduction |
| Transaction History | View token transactions | ⬜ | Test filtering, details |
| Token Expiration | Check expiring tokens alert | ⬜ | If implemented |

---

## 6. Donations

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| Submit Donation | Fill out donation form | ⬜ | Test photo upload, validation |
| Track Donation | View donation status | ⬜ | Pending, approved, rejected |
| Receive Tokens | Get tokens for approved donation | ⬜ | Automatic reward |

---

## 7. Events

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| View Events | Browse event calendar | ⬜ | Repair, swap, upcycle |
| Event Details | View event information | ⬜ | Date, location, description |
| Register | Sign up for an event | ⬜ | Test capacity limits |
| Cancel Registration | Cancel event registration | ⬜ | If implemented |
| Earn Tokens | Receive tokens for attendance | ⬜ | After admin marks attendance |

---

## 8. Sakshi Cafés

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| View Cafés | Browse café locations | ⬜ | Test map, list view |
| Café Details | View café information | ⬜ | Menu, hours, team |
| Join Cooperative | Submit application | ⬜ | Test form submission |

---

## 9. User Dashboard

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| View Dashboard | Access user dashboard | ⬜ | Test all tabs |
| Order History | View past orders | ⬜ | Test details, status |
| Seva Wallet | Check token balance | ⬜ | Test transactions |
| Profile | Update profile information | ⬜ | Test save, validation |
| Public Profile | View own public profile | ⬜ | Test privacy settings |

---

## 10. Admin Dashboard

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| Access Admin | Log in as admin | ⬜ | Test role-based access |
| Overview | View admin dashboard | ⬜ | Test metrics, charts |
| Manage Products | CRUD operations on products | ⬜ | Create, edit, delete |
| Process Donations | Approve/reject donations | ⬜ | Test workflow |
| Create Product | Create product from donation | ⬜ | Test data transfer |
| Manage Orders | View and update orders | ⬜ | Test status changes |
| Manage Events | Create and edit events | ⬜ | Test full workflow |
| Mark Attendance | Record event attendance | ⬜ | Test token rewards |
| Manage Users | View and edit user roles | ⬜ | Test permissions |

---

## 11. AI/ML Features

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| Dynamic Pricing | Test AI price recommendations | ⬜ | Check accuracy |
| Visual Search | Upload image, find similar | ⬜ | Test CLIP model |
| Recommendations | View personalized suggestions | ⬜ | Test relevance |
| Smart Search | Natural language search | ⬜ | Test understanding |
| Chatbot | Ask questions to AI assistant | ⬜ | Test responses |
| Quality Assessment | AI grades product condition | ⬜ | From photos |
| Fraud Detection | Test suspicious activity alerts | ⬜ | If applicable |

---

## 12. SakshiChain (Blockchain)

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| Digital Passport | View product DPP | ⬜ | Test NFT data |
| Product History | See item journey | ⬜ | Test timeline |
| Environmental Impact | View CO2/water savings | ⬜ | Test calculations |
| SAK Wallet | Connect Web3 wallet | ⬜ | Test MetaMask |
| SAK Tokens | View SAK token balance | ⬜ | On blockchain |
| Transfer SAK | Send tokens to another user | ⬜ | Test transaction |

---

## 13. Accessibility (WCAG AA)

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| Keyboard Navigation | Navigate entire site with keyboard | ⬜ | Tab, Enter, arrows |
| Skip to Content | Use skip link | ⬜ | Test focus |
| Screen Reader | Test with NVDA/JAWS | ⬜ | Check announcements |
| Color Contrast | Verify contrast ratios | ⬜ | Use contrast checker |
| Form Labels | All inputs properly labeled | ⬜ | Test ARIA attributes |
| Error Messages | Accessible error handling | ⬜ | Test announcements |
| Focus Indicators | Visible focus states | ⬜ | Test all interactive elements |

---

## 14. Performance & Optimization

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| Page Load Speed | Test homepage load time | ⬜ | Target < 3 seconds |
| Image Optimization | Verify images are compressed | ⬜ | Check file sizes |
| Mobile Performance | Test on mobile devices | ⬜ | iOS, Android |
| Database Queries | Check for N+1 queries | ⬜ | Use profiler |
| Caching | Verify Redis caching works | ⬜ | Test cache hits |

---

## 15. Mobile Responsiveness

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| Mobile Layout | Test on phone (320px-480px) | ⬜ | All pages |
| Tablet Layout | Test on tablet (768px-1024px) | ⬜ | All pages |
| Touch Interactions | Test tap, swipe, pinch | ⬜ | All interactive elements |
| Mobile Menu | Test navigation on mobile | ⬜ | Hamburger menu |

---

## 16. Security

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| SQL Injection | Test input sanitization | ⬜ | All forms |
| XSS Protection | Test script injection | ⬜ | User-generated content |
| CSRF Protection | Verify CSRF tokens | ⬜ | All forms |
| Authentication | Test session management | ⬜ | Timeout, hijacking |
| Authorization | Test role-based access | ⬜ | Admin, user, guest |
| HTTPS | Verify SSL certificate | ⬜ | In production |

---

## 17. Email & Notifications

| Test Case | Description | Status | Notes |
|:---|:---|:---:|:---|
| Welcome Email | Receive after sign up | ⬜ | Test delivery |
| Order Confirmation | Receive after purchase | ⬜ | Test content |
| Donation Approval | Receive when donation approved | ⬜ | Test notification |
| Event Reminder | Receive before event | ⬜ | If implemented |
| Password Reset | Receive reset link | ⬜ | Test expiration |

---

## Testing Summary

**Total Test Cases:** 120+  
**Passed:** ___  
**Failed:** ___  
**Skipped:** ___  
**Pass Rate:** ___%

---

## Critical Bugs Found

| Bug ID | Description | Severity | Status | Assigned To |
|:---:|:---|:---:|:---:|:---|
| | | | | |

---

## Sign-Off

- [ ] All critical test cases passed
- [ ] All high-priority bugs fixed
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Accessibility audit completed
- [ ] Documentation reviewed and updated

**Tested By:** _______________  
**Date:** _______________  
**Approved By:** _______________  
**Date:** _______________

---

*This testing checklist ensures the Sakshi AI Platform meets the highest standards of quality, accessibility, and security before launch.*
