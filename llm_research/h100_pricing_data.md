# H100 GPU Cloud Pricing Research

**Date:** November 9, 2025  
**Source:** Thunder Compute H100 Pricing Comparison (September 2025)

---

## H100 80GB Pricing Per GPU Per Hour (On-Demand)

| Provider | Instance Type | $/GPU/hr | Notes |
|----------|--------------|----------|-------|
| **Vast.ai** | H100 80GB (marketplace) | **$1.87** | Lowest marketplace price, community cloud |
| **RunPod** | H100 80GB PCIe | **$1.99** | Community cloud ($2.39/hr for Secure Cloud) |
| **Lambda Labs** | 8× H100 SXM | **$2.99** | 8-GPU HGX system, reliable |
| **CoreWeave** | 8× H100 HGX with InfiniBand | **$6.16** | HPC-grade, $49.24/hr total for 8 GPUs |
| **Paperspace** | H100 80GB Dedicated | **$5.95** | On-demand, multi-GPU discounts available |
| **Azure** | NC H100 v5 VM | **$6.98** | Single GPU VM, East US region |
| **AWS** | p5.48xlarge (8× H100) | **$7.57** | 8-GPU instance at $60.54/hr total |
| **Oracle Cloud** | BM.GPU.H100.8 | **$10.00** | 8-GPU bare-metal, $80/hr total |
| **Google Cloud** | A3 High (1× H100) | **$11.06** | us-central region |

---

## Cost Analysis for Sakshi Oasis Use Case

### Requirements
- **Model:** Llama 3 8B fine-tuned on Ayurvedic dosha database
- **Usage:** Real-time inference for therapy personalization
- **Concurrent Sessions:** 1-4 simultaneous therapy sessions
- **Hours:** 12 hours/day, 365 days/year
- **Total Annual Hours:** 4,380 hours

### Annual Cost by Provider

| Provider | $/GPU/hr | Annual Cost | 3-Year TCO |
|----------|----------|-------------|------------|
| **Vast.ai** | $1.87 | ₹6.89 lakhs | ₹20.67 lakhs |
| **RunPod** | $1.99 | ₹7.33 lakhs | ₹21.99 lakhs |
| **Lambda Labs** | $2.99 | ₹11.00 lakhs | ₹33.00 lakhs |
| **CoreWeave** | $6.16 | ₹22.67 lakhs | ₹68.01 lakhs |
| **Azure** | $6.98 | ₹25.68 lakhs | ₹77.04 lakhs |
| **AWS** | $7.57 | ₹27.85 lakhs | ₹83.55 lakhs |

**Exchange Rate:** $1 = ₹84

---

## Key Findings

### 1. Vast.ai is Cheapest
- **$1.87/hr** = ₹6.89 lakhs/year
- Marketplace model with variable availability
- Community cloud (less enterprise support)
- **Suitable for:** Cost-conscious startups, flexible workloads

### 2. RunPod is Best Value
- **$1.99/hr** = ₹7.33 lakhs/year
- More reliable than Vast.ai marketplace
- Better uptime and support
- **Suitable for:** Production workloads needing reliability + cost efficiency

### 3. Lambda Labs is Premium Budget Option
- **$2.99/hr** = ₹11.00 lakhs/year
- Most reliable of budget providers
- Excellent support and uptime
- HGX system with high bandwidth
- **Suitable for:** Production workloads needing enterprise-grade reliability

### 4. Hyperscalers are 3-6x More Expensive
- AWS, Azure, Google Cloud: $6.98-$11.06/hr
- ₹25-40 lakhs/year
- Only justified for enterprise compliance requirements

---

## Comparison with On-Premise

### On-Premise H100 Server
- **Capital Cost:** ₹1 crore (4× H100 GPUs + server)
- **Annual Operating:** ₹6 lakhs (power, cooling, maintenance)
- **3-Year TCO:** ₹1.18 crores

### Cloud (RunPod)
- **3-Year TCO:** ₹21.99 lakhs

### Verdict
- **Cloud is 5.4x cheaper** than on-premise for 3-year period
- On-premise only makes sense at 5+ years or multiple locations
- **Recommendation:** Start with cloud, transition to on-premise at scale

---

## Recommendation for Sakshi Oasis

### Phase 1: Launch (Year 1)
**Provider:** RunPod  
**Cost:** ₹7.33 lakhs/year  
**Rationale:**
- Best balance of cost and reliability
- Production-grade uptime
- Good support for startups
- Flexible scaling

### Phase 2: Expansion (Year 2-3)
**Continue Cloud:** RunPod or Lambda Labs  
**Cost:** ₹7-11 lakhs/year per location  
**Rationale:**
- Still cheaper than on-premise at 2-3 locations
- Operational simplicity
- No hardware management overhead

### Phase 3: Scale (Year 4+)
**Transition to On-Premise** for flagship locations  
**Keep Cloud** for franchise locations  
**Rationale:**
- On-premise TCO advantage at 5+ years
- Franchise locations use cloud for simplicity
- Hybrid model optimizes costs

---

## Alternative: Use Smaller Model

### Llama 3 8B vs 70B
- **8B Model:** Can run on single RTX 4090 ($2,000)
- **Inference Speed:** 50-100 tokens/sec on RTX 4090
- **Sufficient for:** Real-time therapy personalization

### RTX 4090 Cloud Pricing
- **Vast.ai:** $0.29/hr
- **RunPod:** $0.39/hr
- **Annual Cost:** ₹1.07-1.43 lakhs

### Verdict
- **RTX 4090 is 5-7x cheaper** than H100
- Llama 3 8B fine-tuned is sufficient for Oasis use case
- **No need for H100** - over-engineered for requirements

---

## FINAL RECOMMENDATION

### Use RTX 4090 Cloud, Not H100

**Provider:** RunPod RTX 4090  
**Cost:** $0.39/hr = ₹1.43 lakhs/year  
**3-Year TCO:** ₹4.29 lakhs  

**Why:**
1. Llama 3 8B is sufficient for dosha-based personalization
2. 5-7x cheaper than H100
3. Still provides real-time inference
4. Can upgrade to H100 later if needed

**Impact on Seed Round:**
- **Original:** ₹10 crores (with ₹1 Cr on-premise H100)
- **Revised:** ₹10 crores (with ₹4.29 lakhs cloud GPU over 3 years)
- **Savings:** ₹96 lakhs that can be reallocated

---

**Status:** Research complete, recommendation ready  
**Next Step:** Create comprehensive TCO analysis document
