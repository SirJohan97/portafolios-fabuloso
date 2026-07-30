import os

with open('effects.js', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update ScrollTrigger timeline config
c = c.replace("end: \"+=140%\",", "end: \"+=260%\",")
c = c.replace("scrub: 1.2,", "scrub: 1.6,")

# 2. Update dealer timing constants
c = c.replace("const DEAL_SPACING = 0.19;", "const DEAL_SPACING = 0.38;")
c = c.replace("const SLIDE_DUR    = 0.30;", "const SLIDE_DUR    = 0.52;")
c = c.replace("const FLIP_DUR     = 0.22;", "const FLIP_DUR     = 0.38;")

with open('effects.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('SUCCESS: Updated timing constants in effects.js')
