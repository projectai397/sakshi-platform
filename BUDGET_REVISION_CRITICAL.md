# Sakshi Oasis - Critical Budget Revision

**Status:** URGENT - Requires Immediate Attention  
**Date:** November 9, 2025  
**Impact:** 40.39% increase in hardware budget

---

## Executive Summary

A comprehensive cost analysis has revealed a **critical underestimation** in the Sakshi Oasis hardware budget, specifically for the LLM Inference Server component. The original estimate of ₹30 lakhs is insufficient for the specified 4x A100/H100 GPU configuration, requiring a revision to **₹1 crore**.

This increases the total hardware and services budget from **₹1.99 crores to ₹2.80 crores**, representing a **₹80.5 lakh (40.39%) increase** that must be addressed before proceeding with procurement.

---

## Budget Discrepancy Analysis

### Original LLM Server Estimate

The initial budget allocated **₹30,00,000** for an LLM Inference Server with 4x A100/H100 equivalent GPUs for running Llama 3 8B model locally.

### Market Reality

Research into actual GPU pricing in India reveals:

**NVIDIA H100 GPU Pricing**
- Single H100 GPU: ₹25-30 lakhs
- 4x H100 GPUs: ₹1.00-1.20 crores (GPUs alone)
- Complete server infrastructure: Additional ₹15-20 lakhs

**Complete Server Configuration**
- 4x NVIDIA H100 80GB GPUs: ₹1.00 crore
- Dual AMD EPYC CPUs: ₹8 lakhs
- 512GB DDR5 RAM: ₹4 lakhs
- 4TB NVMe storage: ₹2 lakhs
- Server chassis and cooling: ₹3 lakhs
- Power supply (redundant): ₹2 lakhs

**Minimum Realistic Cost:** ₹1.19 crores  
**Conservative Estimate:** ₹1.00 crore

### Cost Discrepancy

| Item | Original | Revised | Difference |
|------|----------|---------|------------|
| LLM Inference Server | ₹30 lakhs | ₹1.00 crore | **+₹70 lakhs** |

---

## Revised Budget Breakdown

### Hardware and Services Cost Revision

| Category | Original (₹) | Revised (₹) | Change |
|----------|--------------|-------------|--------|
| **Core Experience Hardware** | | | |
| Generative Projectors (2) | 15,00,000 | 15,00,000 | - |
| VR Headsets (Meta Quest 3, 4 units) | 2,00,000 | 2,00,000 | - |
| Ultrasonic Haptic Device | 20,00,000 | 20,00,000 | - |
| Biometric Sensors Suite | 8,00,000 | 8,00,000 | - |
| Singing Bowls Set | 3,00,000 | 3,00,000 | - |
| Intel RealSense Cameras (4) | 2,00,000 | 2,00,000 | - |
| Muse 2 EEG Headbands (4) | 80,000 | 80,000 | - |
| Custom Copper Plates | 50,000 | 50,000 | - |
| Aromatherapy Diffusers (12) | 60,000 | 60,000 | - |
| Interactive Floor Projectors (2) | 18,00,000 | 18,00,000 | - |
| Spatial Audio System | 40,000 | 40,000 | - |
| **Subtotal - Core Hardware** | **70,30,000** | **70,30,000** | **-** |
| | | | |
| **Technology Infrastructure** | | | |
| LLM Inference Server | 30,00,000 | **1,00,00,000** | **+70,00,000** |
| Central Control System | 5,00,000 | 5,00,000 | - |
| Network Infrastructure | 3,00,000 | 3,00,000 | - |
| Backup Power (UPS) | 2,00,000 | 2,00,000 | - |
| Data Storage Server | 5,00,000 | 5,00,000 | - |
| **Subtotal - Infrastructure** | **45,00,000** | **1,15,00,000** | **+70,00,000** |
| | | | |
| **Installation & Services** | | | |
| Custom Software Development | 25,00,000 | 25,00,000 | - |
| AV System Integration | 15,00,000 | 15,00,000 | - |
| Acoustic Treatment | 10,00,000 | 10,00,000 | - |
| Electrical & HVAC | 8,00,000 | 8,00,000 | - |
| **Subtotal - Services** | **58,00,000** | **58,00,000** | **-** |
| | | | |
| **TOTAL HARDWARE & SERVICES** | **1,73,30,000** | **2,43,30,000** | **+70,00,000** |
| Contingency (15%) | 25,99,500 | 36,49,500 | +10,50,000 |
| **GRAND TOTAL** | **₹1,99,29,500** | **₹2,79,79,500** | **+₹80,49,500** |

### Budget Increase Summary

- **Original Total:** ₹1.99 crores
- **Revised Total:** ₹2.80 crores
- **Increase:** ₹80.5 lakhs
- **Percentage Increase:** 40.39%

---

## Strategic Options

### Option 1: On-Premise Server (Revised Budget)

**Investment:** ₹1.00 crore upfront (CAPEX)

**Advantages:**
- Complete data privacy and security
- Zero latency for real-time AI interactions
- No recurring cloud costs
- Full control over model customization
- Scalable to other locations

**Disadvantages:**
- High upfront capital requirement
- Maintenance and cooling costs (₹2-3 lakhs/year)
- Technical expertise required
- Hardware depreciation

**3-Year TCO:** ₹1.06 crores (₹1.00 cr CAPEX + ₹6 lakhs OPEX)

**Recommended For:** If securing revised seed funding of ₹10.8 crores is feasible.

---

### Option 2: Cloud-Based GPU Service (GPUaaS)

**Investment:** ₹0 upfront, pay-as-you-go (OPEX)

**Providers in India:**
- Neysa AI: H100 GPU at ₹200-250/hour
- AceCloud: A100 GPU at ₹150-200/hour
- AWS/Azure/GCP: H100 at $2-4/hour (₹165-330/hour)

**Cost Estimation:**
- Average usage: 8 hours/day (peak therapy hours)
- 30 days/month = 240 hours/month
- Cost per month: ₹48,000-60,000
- Annual cost: ₹5.76-7.20 lakhs
- 3-year cost: ₹17.28-21.60 lakhs

**Advantages:**
- Zero upfront capital
- Scalable on demand
- No maintenance burden
- Latest hardware access
- Pay only for usage

**Disadvantages:**
- Recurring monthly costs
- Internet dependency
- Data privacy concerns (can be mitigated with VPC)
- Potential latency (50-100ms)
- Vendor lock-in risk

**3-Year TCO:** ₹17-22 lakhs

**Recommended For:** If capital is constrained and recurring costs are acceptable.

---

### Option 3: Hybrid Approach

**Investment:** ₹40-50 lakhs upfront

**Configuration:**
- 2x H100 GPUs (₹50 lakhs) for on-premise baseline
- Cloud burst for peak demand

**Advantages:**
- Balanced capital and operational costs
- Data privacy for core operations
- Cloud flexibility for scaling
- Lower upfront investment than full on-premise

**3-Year TCO:** ₹60-70 lakhs

**Recommended For:** Conservative approach balancing cost and control.

---

## Procurement Strategy (China vs India)

Based on comparative sourcing analysis, the recommended procurement strategy is:

### Source from China (8 of 9 components)

**Components:**
- Generative Projectors (2 units): $8,000-12,000
- Ultrasonic Haptic Device: $5,000-8,000
- VR Headsets (Meta Quest 3): $2,000
- Interactive Floor Projectors (2 units): $6,000-10,000
- Biometric Sensors Suite: $3,000-5,000
- Intel RealSense Cameras: $800-1,200
- Muse 2 EEG Headbands: $1,000
- Aromatherapy Diffusers: $300-500

**Total China Sourcing:** $26,100-39,700 (₹21.8-33.1 lakhs)

**Rationale:**
- 40-60% cost savings vs. India
- Access to specialized R&D and manufacturing
- Established supply chains for high-tech components
- Quality comparable or superior

### Source from India (1 component)

**Components:**
- Custom Copper Plates with Sri Yantra engraving: ₹50,000

**Rationale:**
- Simple custom fabrication
- Local artisan expertise
- No import logistics
- Easy customization

### LLM Server Procurement

**Recommended Vendors (India):**
- **Dell Technologies India:** PowerEdge servers with H100 GPUs
- **HPE India:** ProLiant servers with GPU configuration
- **Supermicro (via distributors):** Custom GPU servers
- **Netweb Technologies:** Indian server manufacturer

**Procurement Timeline:** 8-12 weeks lead time

---

## Impact on Seed Funding Requirements

### Original Seed Round

**Amount:** ₹10 crores for 20% equity

**Allocation:**
- 3 cafe locations: ₹1.35 crores (₹45 lakhs each)
- 1 Oasis sanctuary: ₹1.99 crores (original budget)
- Technology development: ₹1.5 crores
- Marketing: ₹2 crores
- Working capital: ₹1.5 crores
- Team expansion: ₹1.66 crores

### Revised Seed Round (Option 1: On-Premise)

**Amount:** ₹10.8 crores for 20% equity

**Allocation:**
- 3 cafe locations: ₹1.35 crores
- 1 Oasis sanctuary: ₹2.80 crores (revised budget)
- Technology development: ₹1.5 crores
- Marketing: ₹2 crores
- Working capital: ₹1.5 crores
- Team expansion: ₹1.65 crores

**Increase:** ₹80 lakhs (8% increase in total seed requirement)

### Revised Seed Round (Option 2: Cloud)

**Amount:** ₹10 crores for 20% equity (unchanged)

**Allocation:**
- 3 cafe locations: ₹1.35 crores
- 1 Oasis sanctuary: ₹1.99 crores (original, no LLM server)
- Technology development: ₹1.5 crores
- Marketing: ₹2 crores
- Working capital: ₹1.5 crores (includes cloud GPU costs)
- Team expansion: ₹1.66 crores

**Operational Impact:** ₹5-7 lakhs/year cloud GPU costs from working capital

---

## Recommendations

### Immediate Actions (This Week)

1. **Decision Required:** Choose between on-premise, cloud, or hybrid LLM strategy
2. **Investor Communication:** Update pitch deck with revised budget
3. **Procurement Planning:** Initiate RFQs for China-sourced components
4. **Financial Modeling:** Update 3-year projections with revised CAPEX/OPEX

### Short-Term (Month 1)

1. **Secure Funding:** Close seed round with revised amount (₹10.8 cr or ₹10 cr depending on LLM strategy)
2. **Vendor Selection:** Finalize China suppliers and Indian fabricators
3. **Server Procurement:** Place order for LLM server (if on-premise) or set up cloud accounts
4. **Location Finalization:** Secure Oasis location lease

### Medium-Term (Month 2-3)

1. **Hardware Delivery:** Receive and test all components
2. **Installation:** Execute AV integration, acoustic treatment, electrical work
3. **Software Integration:** Deploy custom orchestration software
4. **Staff Training:** Train wellness guides on technology systems

---

## Risk Mitigation

### Financial Risk

**Risk:** Budget overruns beyond revised estimate  
**Mitigation:** 15% contingency buffer (₹36.5 lakhs) included in revised budget

### Technology Risk

**Risk:** LLM server underperformance or compatibility issues  
**Mitigation:** Thorough testing before full deployment, vendor support contracts

### Procurement Risk

**Risk:** Delays in China sourcing due to customs/logistics  
**Mitigation:** 12-week lead time buffer, alternative vendors identified

### Market Risk

**Risk:** Investors hesitant about 40% budget increase  
**Mitigation:** Emphasize cloud option as viable alternative, demonstrate strong ROI with either approach

---

## Conclusion

The 40% budget increase is significant but manageable through strategic decision-making. The cloud-based GPU option provides a viable path forward without increasing seed funding requirements, while the on-premise option offers superior long-term economics for a modest 8% increase in seed capital.

**Recommended Path:** Pursue **Option 2 (Cloud-Based)** for the first Oasis location to minimize upfront capital requirements and prove the business model. Once revenue is established, transition to **Option 1 (On-Premise)** for subsequent locations to optimize long-term economics.

This approach balances capital efficiency with operational flexibility, allowing Sakshi to launch quickly while building toward cost-optimized scaling.

---

**Next Steps:** Update investor pitch deck with revised financials and present both options to potential investors for strategic decision.
