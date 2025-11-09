import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Set style
plt.style.use('seaborn-v0_8-darkgrid')
plt.rcParams['figure.figsize'] = (14, 8)
plt.rcParams['font.size'] = 11

# Exchange rate
USD_TO_INR = 84

# Define all options
options = {
    'RTX 4090 Cloud (RunPod Secure)': {
        'type': 'cloud',
        'hourly_rate_usd': 0.59,
        'capex': 0,
        'annual_opex_fixed': 0,
        'color': '#16a34a'  # green
    },
    'RTX 4090 Cloud (RunPod Community)': {
        'type': 'cloud',
        'hourly_rate_usd': 0.34,
        'capex': 0,
        'annual_opex_fixed': 0,
        'color': '#22c55e'  # light green
    },
    'RTX 4090 On-Premise': {
        'type': 'on-premise',
        'hourly_rate_usd': 0,
        'capex': 250000,  # ₹2.5 lakhs
        'annual_opex_fixed': 50000,  # ₹50k/year
        'color': '#3b82f6'  # blue
    },
    'H100 Cloud (RunPod)': {
        'type': 'cloud',
        'hourly_rate_usd': 1.99,
        'capex': 0,
        'annual_opex_fixed': 0,
        'color': '#ef4444'  # red
    },
    'H100 On-Premise (4× GPUs)': {
        'type': 'on-premise',
        'hourly_rate_usd': 0,
        'capex': 10000000,  # ₹1 crore
        'annual_opex_fixed': 600000,  # ₹6 lakhs/year
        'color': '#dc2626'  # dark red
    }
}

# Usage pattern
HOURS_PER_DAY = 12
DAYS_PER_YEAR = 365
ANNUAL_HOURS = HOURS_PER_DAY * DAYS_PER_YEAR

# Calculate costs
years = np.arange(1, 6)  # 1 to 5 years
results = {}

for name, config in options.items():
    costs = []
    for year in years:
        if config['type'] == 'cloud':
            # Cloud: hourly rate × hours × years
            cost = config['hourly_rate_usd'] * USD_TO_INR * ANNUAL_HOURS * year
        else:
            # On-premise: CAPEX + (OPEX × years)
            cost = config['capex'] + (config['annual_opex_fixed'] * year)
        costs.append(cost / 100000)  # Convert to lakhs
    
    results[name] = {
        'costs': costs,
        'color': config['color'],
        'year_1': costs[0],
        'year_3': costs[2],
        'year_5': costs[4]
    }

# Create visualizations
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))
fig.suptitle('LLM Infrastructure TCO Analysis for Sakshi Oasis\n(12 hours/day, 365 days/year)', 
             fontsize=16, fontweight='bold')

# Plot 1: TCO Over 5 Years (Line Chart)
ax1.set_title('Total Cost of Ownership Over 5 Years', fontsize=14, fontweight='bold')
for name, data in results.items():
    ax1.plot(years, data['costs'], marker='o', linewidth=2.5, 
             label=name, color=data['color'], markersize=8)
ax1.set_xlabel('Years', fontsize=12, fontweight='bold')
ax1.set_ylabel('Total Cost (₹ Lakhs)', fontsize=12, fontweight='bold')
ax1.legend(loc='upper left', fontsize=10)
ax1.grid(True, alpha=0.3)
ax1.set_xticks(years)

# Plot 2: Year 1 Cost Comparison (Bar Chart)
ax2.set_title('Year 1 Cost Comparison', fontsize=14, fontweight='bold')
names = list(results.keys())
year_1_costs = [results[name]['year_1'] for name in names]
colors = [results[name]['color'] for name in names]
bars = ax2.barh(names, year_1_costs, color=colors, alpha=0.8)
ax2.set_xlabel('Cost (₹ Lakhs)', fontsize=12, fontweight='bold')
ax2.set_ylabel('')
for i, (bar, cost) in enumerate(zip(bars, year_1_costs)):
    ax2.text(cost + 1, i, f'₹{cost:.2f}L', va='center', fontweight='bold')
ax2.grid(True, axis='x', alpha=0.3)

# Plot 3: Year 3 Cost Comparison (Bar Chart)
ax3.set_title('Year 3 TCO Comparison', fontsize=14, fontweight='bold')
year_3_costs = [results[name]['year_3'] for name in names]
bars = ax3.barh(names, year_3_costs, color=colors, alpha=0.8)
ax3.set_xlabel('Total Cost (₹ Lakhs)', fontsize=12, fontweight='bold')
ax3.set_ylabel('')
for i, (bar, cost) in enumerate(zip(bars, year_3_costs)):
    ax3.text(cost + 2, i, f'₹{cost:.2f}L', va='center', fontweight='bold')
ax3.grid(True, axis='x', alpha=0.3)

# Plot 4: Cost Savings vs H100 On-Premise (Bar Chart)
ax4.set_title('Cost Savings vs H100 On-Premise (3-Year TCO)', fontsize=14, fontweight='bold')
h100_on_prem_cost = results['H100 On-Premise (4× GPUs)']['year_3']
savings = [h100_on_prem_cost - results[name]['year_3'] for name in names if name != 'H100 On-Premise (4× GPUs)']
savings_names = [name for name in names if name != 'H100 On-Premise (4× GPUs)']
savings_colors = [results[name]['color'] for name in savings_names]
bars = ax4.barh(savings_names, savings, color=savings_colors, alpha=0.8)
ax4.set_xlabel('Savings (₹ Lakhs)', fontsize=12, fontweight='bold')
ax4.set_ylabel('')
for i, (bar, saving) in enumerate(zip(bars, savings)):
    ax4.text(saving + 5, i, f'₹{saving:.2f}L', va='center', fontweight='bold', color='green')
ax4.grid(True, axis='x', alpha=0.3)
ax4.axvline(x=0, color='black', linestyle='-', linewidth=0.8)

plt.tight_layout()
plt.savefig('/home/ubuntu/sakshi/llm_research/tco_analysis.png', dpi=300, bbox_inches='tight')
print("TCO analysis visualization saved to /home/ubuntu/sakshi/llm_research/tco_analysis.png")

# Create summary table
summary_data = []
for name, data in results.items():
    summary_data.append({
        'Option': name,
        'Year 1 (₹L)': f"{data['year_1']:.2f}",
        'Year 3 (₹L)': f"{data['year_3']:.2f}",
        'Year 5 (₹L)': f"{data['year_5']:.2f}"
    })

df = pd.DataFrame(summary_data)
print("\n=== TCO Summary Table ===")
print(df.to_string(index=False))

# Calculate key metrics
rtx_4090_secure = results['RTX 4090 Cloud (RunPod Secure)']['year_3']
h100_cloud = results['H100 Cloud (RunPod)']['year_3']
h100_on_prem = results['H100 On-Premise (4× GPUs)']['year_3']

print(f"\n=== Key Findings (3-Year TCO) ===")
print(f"RTX 4090 Cloud (Secure): ₹{rtx_4090_secure:.2f} lakhs")
print(f"H100 Cloud: ₹{h100_cloud:.2f} lakhs")
print(f"H100 On-Premise: ₹{h100_on_prem:.2f} lakhs")
print(f"\nRTX 4090 vs H100 Cloud: {h100_cloud/rtx_4090_secure:.1f}x cheaper")
print(f"RTX 4090 vs H100 On-Premise: {h100_on_prem/rtx_4090_secure:.1f}x cheaper")
print(f"\nTotal Savings (RTX 4090 vs H100 On-Premise): ₹{h100_on_prem - rtx_4090_secure:.2f} lakhs")

