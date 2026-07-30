import os

with open('effects.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('badge: "THE WINNING HAND", title: "VANTA ENGINE 2025",', 'badge: "THE WINNING HAND", title: "CRITERIO",')

with open('effects.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('SUCCESS: Updated title in techSpecsData in effects.js!')
