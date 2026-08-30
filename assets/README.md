# Assets Folder

Drop your image files here, **keeping the exact filenames** below so the
site picks them up automatically.

## Root Assets

| Filename | Purpose | Recommended size |
|----------|---------|------------------|
| `profile-600.jpg` | Hero avatar (square crop, optimized 600×600) | 600×600 |
| `og-cover.jpg` | Social share preview (Open Graph / Twitter) | 1200×630 |
| `Abdullah_ALGhoul_CV.pdf` | Downloadable CV | any |
| `dr-almasri.jpg` | Mr. Almasri photo (Recommendations) | 200×200 |
| `dr-ahmed.jpg` | Dr. Ahmed photo (Recommendations) | 200×200 |
| `yazan.jpg` | Yazan photo (Recommendations) | 200×200 |

> If a recommendation photo is missing, the site will show colored initials (AB, AA, YW) instead of breaking. So it's optional but recommended.

## Certificates (`certs/` subfolder)

Drop your certificate images into `certs/`. Use **JPG or PNG** and keep the
filenames below — each cert card opens its image in a lightbox when clicked.

| Filename | Certificate |
|----------|-------------|
| `fa03448a.jpg` | M3aarf Platform — Learn Git & GitHub |
| `google-ai-fundamentals.jpg` | Google · Coursera — AI Fundamentals |
| `nvidia-ai.jpg` | NVIDIA AI for All: From Basics to GenAI Practice |
| `openai-ai-foundations.jpg` | OpenAI Academy — AI Foundations |
| `anthropic-claude101.png` | Anthropic — Claude 101 |
| `anthropic-claude-code-101.png` | Anthropic — Claude Code 101 |
| `claude-code-in-action.jpg` | Anthropic · Coursera — Claude Code in Action |
| `saylor-cs101.jpg` | Saylor Academy CS101: Intro to Programming I |
| `icdl.jpg` | Edraak ICDL Base Certification |
| `hp-data-science.jpg` | HP LIFE — Data Science & Analytics |
| `hp-critical-thinking.jpg` | HP LIFE — Critical Thinking in the Age of AI |

> **Tip:** if you don't have a certificate image yet, the modal will still
> open but show a graceful "image not uploaded yet" message.

## Fallback Behavior

Every photo on the site has a built-in fallback:

- Missing **profile-600.jpg** → shows a stylized `>_` monogram
- Missing **recommendation photo** → shows colored initials (AB / AA / YW)
- Missing **certificate image** → modal opens with a "not uploaded" notice
- Missing **CV.pdf** → link breaks (404); upload the file or hide the button
