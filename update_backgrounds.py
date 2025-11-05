#!/usr/bin/env python3
import os
import re

# Define page to background mapping
page_backgrounds = {
    "Home.tsx": "adiyogi-bg-1",
    "About.tsx": "adiyogi-bg-2",
    "Shop.tsx": "adiyogi-bg-3",
    "ProductDetail.tsx": "adiyogi-bg-4",
    "Cafes.tsx": "adiyogi-bg-mountain",
    "RepairCafe.tsx": "adiyogi-bg-sunset",
    "Retreats.tsx": "adiyogi-bg-forest",
    "Meditate.tsx": "adiyogi-bg-nature",
    "CircularEconomy.tsx": "adiyogi-bg-1",
    "Volunteer.tsx": "adiyogi-bg-2",
    "Donate.tsx": "adiyogi-bg-3",
    "Contact.tsx": "adiyogi-bg-4",
    "FAQ.tsx": "adiyogi-bg-mountain",
    "HowItWorks.tsx": "adiyogi-bg-sunset",
    "Profile.tsx": "adiyogi-bg-forest",
    "SevaWallet.tsx": "adiyogi-bg-nature"
}

pages_dir = "/home/ubuntu/sakshi/client/src/pages"

for filename, bg_class in page_backgrounds.items():
    filepath = os.path.join(pages_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename} - file not found")
        continue
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace watercolor-bg with adiyogi background in main sections
    updated_content = re.sub(
        r'className="([^"]*?)watercolor-bg([^"]*?)"',
        f'className="\\1{bg_class}\\2"',
        content,
        count=1  # Only replace first occurrence (usually hero section)
    )
    
    # Also update any standalone watercolor-bg
    if updated_content == content:
        updated_content = re.sub(
            r'watercolor-bg',
            bg_class,
            content,
            count=1
        )
    
    with open(filepath, 'w') as f:
        f.write(updated_content)
    
    print(f"✓ Updated {filename} with {bg_class}")

print("\n✨ All pages updated with Adiyogi Ghibli backgrounds!")
