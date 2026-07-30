import os

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update Central Master Card title from VANTA ENGINE to CRITERIO
c = c.replace('<h3 class="poker-card-title master-title">VANTA ENGINE</h3>', '<h3 class="poker-card-title master-title">CRITERIO</h3>')

# 2. Extract modal HTML block
modal_start_str = '<!-- Fullscreen Glass Modal: Inspection HD Showcase -->'
modal_end_str = '</div>\n        </div>\n    </section>'

start_pos = c.find(modal_start_str)
if start_pos != -1:
    end_pos = c.find('</section>', start_pos)
    modal_code = c[start_pos:end_pos].strip()
    
    # Remove modal from section
    c = c[:start_pos].rstrip() + '\n    </section>' + c[end_pos + len('</section>'):]

    # Insert modal right before scripts (before <!-- Libraries for Awwwards Premium Effects -->)
    script_pos = c.find('<!-- Libraries for Awwwards Premium Effects -->')
    if script_pos != -1:
        c = c[:script_pos] + modal_code + '\n\n    ' + c[script_pos:]
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(c)
        print('SUCCESS: Moved modal out of pinned section and updated card title to CRITERIO!')
    else:
        print('ERROR: script_pos not found')
else:
    print('ERROR: modal_start_pos not found')
