import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are a senior CRO (Conversion Rate Optimisation) strategist working for a digital marketing agency that specialises in Shopify ecommerce stores. Your output is used directly by UI/UX designers to create wireframes.

You work in TWO STAGES:

---

## STAGE 1 — Find Competitors

When given a brand website URL:
1. Use web search to visit and understand the brand — what they sell, product categories, price range, target audience.
2. Search for 3 to 5 direct competitors using these criteria in order:
   - FIRST: sells same or very similar products
   - SECOND: same product category
   - THIRD: similar price range (within 30%)
   - FOURTH: same target customer
3. Return a structured competitor list with:
   - Name and URL of each competitor
   - Which criteria they match (as badge labels)
   - 3-5 bullet points of what they share with the client brand
   - One key insight for the designer

Format Stage 1 output as clean HTML with these exact styles:
- White cards with border-radius:12px, box-shadow:0 2px 12px rgba(0,0,0,0.08), padding:24px, margin-bottom:16px
- Competitor name in bold 18px dark navy (#0f1f3d)
- URL as a clickable orange link (#e8622a)
- Criteria badges: small pills, background:#fff4ee, color:#e8622a, border:1px solid #ffd4bb, border-radius:20px, padding:3px 10px, font-size:12px, margin:2px
- Bullet points in 14px #444
- Key insight box: background:#fff8f5, border-left:3px solid #e8622a, padding:12px 16px, border-radius:0 8px 8px 0, margin-top:12px, font-size:13px

Then end Stage 1 with this exact HTML:
<div style="background:#f0f7ff;border:1px solid #c0d8f5;border-radius:12px;padding:20px 24px;margin-top:24px;text-align:center">
  <p style="font-size:15px;color:#1a4a8a;margin:0 0 12px;font-weight:600">✓ Competitor list ready. Confirm to run full page analysis.</p>
  <p style="font-size:13px;color:#4a6a9a;margin:0">Review the competitors above — then click <strong>Proceed to Analysis</strong> below.</p>
</div>

---

## STAGE 2 — Page Section Analysis

After the user confirms, visit each competitor's homepage and product page. Map every section present.

### HOMEPAGE sections to look for:
Navigation bar, Hero/Banner, Social proof bar (press logos), Featured products, Brand story, Before/After results, How it works, UGC/Instagram feed, Quiz/product finder, Subscription section, Trust badges, Email capture, Footer

### PRODUCT PAGE sections to look for:
Image gallery, Product title+description, Price display, Variant selector, Add to Cart button, Urgency/scarcity signals, Delivery promise, Trust badges, Long description, Ingredients/What's inside, How to use, Reviews, Q&A, Cross-sell/upsell, Bundle offer

### OUTPUT FORMAT for Stage 2:

**Part A — Comparison Tables**
Two HTML tables (one for Homepage, one for Product Page):
- Table style: width:100%, border-collapse:collapse, font-size:13px
- Header row: background:#0f1f3d, color:white, padding:10px 14px, text-align:center
- First column (section names): font-weight:600, background:#f8f9fa, padding:10px 14px
- Data cells: padding:10px 14px, text-align:center, border:1px solid #e8ecf0
- GREEN row (background:#f0fff6): client already has this section — show ✓ in green
- RED row (background:#fff5f5): client missing it, 3+ competitors have it — HIGH priority
- AMBER row (background:#fffbf0): client missing it, 2 competitors have it — MEDIUM priority
- Each cell shows ✓ or ✗
- Last column "Competitors Using": shows fraction like "4/4" or "2/4"

**Part B — Recommendation Cards**
For HOMEPAGE and PRODUCT PAGE separately, one card per missing section:

Each card HTML structure:
<div style="border:1px solid #e8ecf0;border-radius:12px;padding:20px 24px;margin-bottom:12px;background:white">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
    <div style="display:flex;align-items:center;gap:10px">
      <span style="[priority badge style]">[HIGH/MEDIUM/LOW]</span>
      <strong style="font-size:16px;color:#0f1f3d">[Section Name]</strong>
    </div>
    <span style="font-size:13px;color:#888;background:#f5f5f5;padding:4px 12px;border-radius:20px">[X of Y competitors]</span>
  </div>
  <p style="font-size:14px;color:#333;margin:0 0 10px"><strong>What to build:</strong> [specific description for designer]</p>
  <p style="font-size:13px;color:#555;margin:0 0 10px"><strong>Why it converts:</strong> [one sentence on conversion impact]</p>
</div>

Priority badge styles:
- HIGH: background:#fff0f0;color:#c0392b;border:1px solid #f5b8b8;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700
- MEDIUM: background:#fffbf0;color:#d68910;border:1px solid #f5dfa0;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700
- LOW: background:#f5f5f5;color:#777;border:1px solid #ddd;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700

**Part C — Summary Box**
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
  <div style="background:#f0fff6;border:1px solid #a8e6c4;border-radius:12px;padding:20px">
    <h4 style="color:#1a7a4a;margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:1px">⚡ Quick Wins</h4>
    [numbered list of simple, high-impact sections]
  </div>
  <div style="background:#fff8f0;border:1px solid #f5cfa0;border-radius:12px;padding:20px">
    <h4 style="color:#b8590a;margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:1px">🎯 Big Bets</h4>
    [numbered list of complex but high-conversion sections]
  </div>
</div>

Always write for a UI/UX designer. Be specific about placement, content, and purpose. Lead every recommendation with evidence.`;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f5f3ef;
    color: #1a1713;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* HEADER */
  .header {
    background: #0f1f3d;
    padding: 0 40px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .header-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .header-icon {
    width: 32px; height: 32px;
    background: #e8622a;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .header-title {
    font-family: 'Fraunces', serif;
    font-size: 18px;
    font-weight: 700;
    color: white;
    letter-spacing: -0.3px;
  }
  .header-title span {
    color: #e8622a;
    font-style: italic;
  }
  .header-badge {
    font-size: 11px;
    background: rgba(232,98,42,0.2);
    color: #ff9a70;
    border: 1px solid rgba(232,98,42,0.3);
    border-radius: 20px;
    padding: 3px 12px;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.5px;
  }

  /* MAIN LAYOUT */
  .layout {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 0;
    flex: 1;
    min-height: calc(100vh - 60px);
  }

  /* SIDEBAR */
  .sidebar {
    background: white;
    border-right: 1px solid #e8e4dc;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    position: sticky;
    top: 60px;
    height: calc(100vh - 60px);
  }

  .sidebar-section-title {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 12px;
  }

  .url-input-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .url-input-wrap label {
    font-size: 13px;
    font-weight: 600;
    color: #0f1f3d;
  }
  .url-input-wrap input {
    width: 100%;
    padding: 12px 14px;
    border: 1.5px solid #e0dbd0;
    border-radius: 10px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: #1a1713;
    background: #faf9f7;
    outline: none;
    transition: border-color 0.15s;
  }
  .url-input-wrap input:focus {
    border-color: #e8622a;
    background: white;
  }
  .url-input-wrap input::placeholder { color: #bbb; }

  .client-name-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .client-name-wrap label {
    font-size: 13px;
    font-weight: 600;
    color: #0f1f3d;
  }
  .client-name-wrap input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #e0dbd0;
    border-radius: 10px;
    font-size: 13px;
    color: #1a1713;
    background: #faf9f7;
    outline: none;
    transition: border-color 0.15s;
  }
  .client-name-wrap input:focus {
    border-color: #e8622a;
    background: white;
  }

  .run-btn {
    width: 100%;
    padding: 14px;
    background: #e8622a;
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .run-btn:hover:not(:disabled) {
    background: #cf5524;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(232,98,42,0.3);
  }
  .run-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .proceed-btn {
    width: 100%;
    padding: 14px;
    background: #1a7a4a;
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    animation: pulse-green 2s infinite;
  }
  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 0 0 rgba(26,122,74,0.4); }
    50% { box-shadow: 0 0 0 8px rgba(26,122,74,0); }
  }
  .proceed-btn:hover {
    background: #155f3a;
  }

  .reset-btn {
    width: 100%;
    padding: 10px;
    background: transparent;
    color: #888;
    border: 1.5px solid #e0dbd0;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .reset-btn:hover { border-color: #e8622a; color: #e8622a; }

  /* STAGE TRACKER */
  .stage-tracker {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .stage-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    position: relative;
  }
  .stage-item:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 13px;
    top: 36px;
    bottom: -4px;
    width: 1px;
    background: #e8e4dc;
  }
  .stage-dot {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
    font-weight: 700;
    font-family: 'DM Mono', monospace;
    z-index: 1;
  }
  .stage-dot.idle { background: #f0ece4; color: #bbb; border: 1.5px solid #e0dbd0; }
  .stage-dot.active { background: #fff4ee; color: #e8622a; border: 1.5px solid #e8622a; animation: spin-dot 1.5s linear infinite; }
  @keyframes spin-dot {
    0%, 100% { box-shadow: 0 0 0 0 rgba(232,98,42,0.4); }
    50% { box-shadow: 0 0 0 6px rgba(232,98,42,0); }
  }
  .stage-dot.done { background: #1a7a4a; color: white; border: 1.5px solid #1a7a4a; }
  .stage-dot.waiting { background: #fff8e8; color: #d68910; border: 1.5px solid #d68910; }
  .stage-info { flex: 1; padding-top: 4px; }
  .stage-name { font-size: 13px; font-weight: 600; color: #0f1f3d; }
  .stage-desc { font-size: 12px; color: #888; margin-top: 2px; }

  /* HOW TO USE */
  .how-to {
    background: #f5f3ef;
    border-radius: 10px;
    padding: 16px;
  }
  .how-to-item {
    display: flex;
    gap: 10px;
    padding: 6px 0;
    font-size: 12.5px;
    color: #555;
    align-items: flex-start;
  }
  .how-to-item .num {
    width: 18px; height: 18px;
    background: #0f1f3d;
    color: white;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* OUTPUT PANEL */
  .output-panel {
    background: #faf9f7;
    overflow-y: auto;
    padding: 40px;
  }

  /* EMPTY STATE */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 400px;
    text-align: center;
    gap: 16px;
  }
  .empty-icon {
    width: 72px; height: 72px;
    background: white;
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }
  .empty-title {
    font-family: 'Fraunces', serif;
    font-size: 24px;
    font-weight: 700;
    color: #0f1f3d;
  }
  .empty-sub { font-size: 14px; color: #888; max-width: 300px; line-height: 1.7; }

  /* LOADING */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 80px 40px;
    text-align: center;
  }
  .loading-spinner {
    width: 48px; height: 48px;
    border: 3px solid #e8e4dc;
    border-top-color: #e8622a;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-title {
    font-family: 'Fraunces', serif;
    font-size: 22px;
    font-weight: 700;
    color: #0f1f3d;
  }
  .loading-sub { font-size: 14px; color: #888; }
  .loading-steps {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }
  .loading-step {
    font-size: 13px;
    color: #aaa;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }
  .loading-step.active { color: #e8622a; font-weight: 500; }
  .loading-step.done { color: #1a7a4a; }

  /* REPORT HEADER */
  .report-header {
    background: #0f1f3d;
    border-radius: 16px;
    padding: 28px 32px;
    margin-bottom: 28px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .report-header h1 {
    font-family: 'Fraunces', serif;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .report-header h1 em { color: #ff9a70; font-style: italic; }
  .report-header p { font-size: 13px; color: rgba(255,255,255,0.5); }
  .report-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }
  .report-meta-pill {
    font-size: 11px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 20px;
    padding: 4px 12px;
    color: rgba(255,255,255,0.7);
    font-family: 'DM Mono', monospace;
  }

  /* SECTION LABEL */
  .section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #e8622a;
    margin-bottom: 12px;
    margin-top: 32px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e8e4dc;
  }

  /* OUTPUT CONTENT */
  .output-content {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    line-height: 1.7;
    font-size: 14px;
    color: #2a2520;
  }
  .output-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 13px;
  }

  /* DOWNLOAD BUTTON */
  .download-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: white;
    border: 1.5px solid #e0dbd0;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #0f1f3d;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
    margin-top: 24px;
  }
  .download-btn:hover {
    border-color: #e8622a;
    color: #e8622a;
  }

  /* API KEY INPUT */
  .api-key-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .api-key-wrap label {
    font-size: 13px;
    font-weight: 600;
    color: #0f1f3d;
  }
  .api-key-wrap input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #e0dbd0;
    border-radius: 10px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #1a1713;
    background: #faf9f7;
    outline: none;
    transition: border-color 0.15s;
  }
  .api-key-wrap input:focus { border-color: #e8622a; background: white; }
  .api-key-note {
    font-size: 11px;
    color: #aaa;
    line-height: 1.5;
  }

  .divider {
    height: 1px;
    background: #f0ece4;
    margin: 4px 0;
  }

  @media (max-width: 768px) {
    .layout { grid-template-columns: 1fr; }
    .sidebar { position: static; height: auto; }
    .header { padding: 0 20px; }
    .output-panel { padding: 20px; }
  }
`;

const STAGE_CONFIG = [
  { id: "discover", label: "Discover Brand", desc: "Reading client website" },
  { id: "competitors", label: "Find Competitors", desc: "Searching for similar brands" },
  { id: "waiting", label: "Awaiting Approval", desc: "Review competitor list" },
  { id: "analyse", label: "Analyse Pages", desc: "Mapping sections on each site" },
  { id: "recommend", label: "Build Report", desc: "Generating recommendations" },
];

export default function CROAgent() {
  const [apiKey, setApiKey] = useState("");
  const [clientUrl, setClientUrl] = useState("");
  const [clientName, setClientName] = useState("");
  const [stage, setStage] = useState("idle"); // idle | stage1-loading | stage1-done | stage2-loading | stage2-done | error
  const [stage1Output, setStage1Output] = useState("");
  const [stage2Output, setStage2Output] = useState("");
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const outputRef = useRef(null);

  useEffect(() => {
    if (stage.includes("loading")) {
      const interval = setInterval(() => {
        setLoadingStep(p => (p + 1) % 4);
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [stage]);

  useEffect(() => {
    if (outputRef.current && (stage === "stage1-done" || stage === "stage2-done")) {
      outputRef.current.scrollTop = 0;
    }
  }, [stage]);

  async function callClaude(messages) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages,
        tools: [{ type: "web_search_20250305", name: "web_search" }]
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "API error");
    }
    const data = await res.json();
    return data.content.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n");
  }

  async function runStage1() {
    if (!apiKey.trim()) { setError("Please enter your Anthropic API key."); return; }
    if (!clientUrl.trim()) { setError("Please enter the client brand URL."); return; }
    setError("");
    setStage("stage1-loading");
    setLoadingStep(0);
    try {
      const prompt = `The client brand website is: ${clientUrl}
Client name for reports: ${clientName || "Client"}

Run STAGE 1 only:
1. Visit and understand this brand — products, categories, price range, audience.
2. Search for 3 to 5 direct competitors matching the criteria in your instructions.
3. Return the competitor shortlist as formatted HTML exactly as specified.
4. End with the confirmation box HTML as specified.`;
      const output = await callClaude([{ role: "user", content: prompt }]);
      setStage1Output(output);
      setStage("stage1-done");
    } catch (e) {
      setError(e.message);
      setStage("idle");
    }
  }

  async function runStage2() {
    setStage("stage2-loading");
    setLoadingStep(0);
    try {
      const prompt = `The client brand website is: ${clientUrl}
Client name: ${clientName || "Client"}

The competitor shortlist from Stage 1 was:
${stage1Output}

Now run STAGE 2 — the full page section analysis:
1. Visit each competitor's homepage and product page.
2. Map every section present on each page.
3. Compare against the client brand site.
4. Output Part A (comparison tables), Part B (recommendation cards), and Part C (quick wins vs big bets) as formatted HTML exactly as specified in your instructions.`;
      const output = await callClaude([{ role: "user", content: prompt }]);
      setStage2Output(output);
      setStage("stage2-done");
    } catch (e) {
      setError(e.message);
      setStage("stage1-done");
    }
  }

  function reset() {
    setStage("idle");
    setStage1Output("");
    setStage2Output("");
    setError("");
    setLoadingStep(0);
  }

  function downloadReport(content, filename) {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${filename}</title>
<style>body{font-family:system-ui,sans-serif;max-width:960px;margin:40px auto;padding:0 24px;color:#1a1713;line-height:1.7}
table{width:100%;border-collapse:collapse;margin:16px 0}th,td{padding:10px 14px;border:1px solid #e0dbd0;text-align:left}
th{background:#0f1f3d;color:white}</style></head>
<body>${content}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename + ".html";
    a.click();
  }

  function getStageStatus(stageId) {
    const order = ["discover", "competitors", "waiting", "analyse", "recommend"];
    const activeMap = {
      "stage1-loading": stageId === "discover" || stageId === "competitors" ? "active" : "idle",
      "stage1-done": stageId === "waiting" ? "waiting" : (stageId === "discover" || stageId === "competitors") ? "done" : "idle",
      "stage2-loading": stageId === "discover" || stageId === "competitors" || stageId === "waiting" ? "done" : stageId === "analyse" || stageId === "recommend" ? "active" : "idle",
      "stage2-done": "done",
    };
    return activeMap[stage] || "idle";
  }

  const loadingMessages = [
    ["🔍 Reading client website...", "🔎 Searching for competitors...", "📊 Analysing brand positioning...", "⚡ Building competitor shortlist..."],
    ["🌐 Visiting competitor homepages...", "📋 Mapping page sections...", "🔬 Analysing product pages...", "✍️ Writing recommendations..."]
  ];
  const currentLoadingSet = stage === "stage1-loading" ? 0 : 1;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="header-logo">
            <div className="header-icon">🎯</div>
            <span className="header-title">CRO <span>Research</span> Agent</span>
          </div>
          <span className="header-badge">POWERED BY CLAUDE</span>
        </header>

        <div className="layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            {/* API KEY */}
            <div>
              <div className="sidebar-section-title">API Key</div>
              <div className="api-key-wrap">
                <label>Anthropic API Key</label>
                <input
                  type="password"
                  placeholder="sk-ant-..."
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                />
                <span className="api-key-note">
                  Get your key at console.anthropic.com. It stays in your browser only.
                </span>
              </div>
            </div>

            <div className="divider" />

            {/* INPUTS */}
            <div>
              <div className="sidebar-section-title">Client Details</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="url-input-wrap">
                  <label>Client Brand Website URL</label>
                  <input
                    type="url"
                    placeholder="https://www.clientbrand.com"
                    value={clientUrl}
                    onChange={e => setClientUrl(e.target.value)}
                    disabled={stage !== "idle"}
                  />
                </div>
                <div className="client-name-wrap">
                  <label>Client Name (for reports)</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Grooming"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    disabled={stage !== "idle"}
                  />
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {stage === "idle" && (
                <button className="run-btn" onClick={runStage1}
                  disabled={!clientUrl.trim() || !apiKey.trim()}>
                  🔍 Find Competitors
                </button>
              )}
              {stage === "stage1-done" && (
                <>
                  <button className="proceed-btn" onClick={runStage2}>
                    ✓ Proceed to Full Analysis
                  </button>
                  <button className="reset-btn" onClick={reset}>Start Over</button>
                </>
              )}
              {stage === "stage2-done" && (
                <button className="reset-btn" onClick={reset}>New Client</button>
              )}
              {(stage === "stage1-loading" || stage === "stage2-loading") && (
                <button className="run-btn" disabled>Working...</button>
              )}
            </div>

            {error && (
              <div style={{ background: "#fff0f0", border: "1px solid #f5b8b8", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: "#c0392b" }}>
                ⚠️ {error}
              </div>
            )}

            <div className="divider" />

            {/* STAGE TRACKER */}
            <div>
              <div className="sidebar-section-title">Progress</div>
              <div className="stage-tracker">
                {STAGE_CONFIG.map(s => {
                  const status = getStageStatus(s.id);
                  return (
                    <div className="stage-item" key={s.id}>
                      <div className={`stage-dot ${status}`}>
                        {status === "done" ? "✓" : status === "waiting" ? "⏸" : s.id === "discover" ? "1" : s.id === "competitors" ? "2" : s.id === "waiting" ? "3" : s.id === "analyse" ? "4" : "5"}
                      </div>
                      <div className="stage-info">
                        <div className="stage-name" style={{ color: status === "active" ? "#e8622a" : status === "done" ? "#1a7a4a" : status === "waiting" ? "#d68910" : "#0f1f3d" }}>{s.label}</div>
                        <div className="stage-desc">{s.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="divider" />

            {/* HOW TO USE */}
            <div>
              <div className="sidebar-section-title">How to Use</div>
              <div className="how-to">
                {["Enter your Anthropic API key", "Paste the client's Shopify store URL", "Click Find Competitors — review the list", "Click Proceed to get page recommendations", "Download the HTML report for your designer"].map((t, i) => (
                  <div className="how-to-item" key={i}>
                    <span className="num">{i + 1}</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* OUTPUT PANEL */}
          <main className="output-panel" ref={outputRef}>

            {/* EMPTY STATE */}
            {stage === "idle" && (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <div className="empty-title">Ready to Research</div>
                <div className="empty-sub">Enter your client's brand URL and click Find Competitors. The agent will do everything else.</div>
              </div>
            )}

            {/* LOADING */}
            {(stage === "stage1-loading" || stage === "stage2-loading") && (
              <div className="loading-state">
                <div className="loading-spinner" />
                <div className="loading-title">
                  {stage === "stage1-loading" ? "Finding Competitors..." : "Analysing Pages..."}
                </div>
                <div className="loading-sub">
                  {stage === "stage1-loading"
                    ? "Visiting the client site and searching for similar brands"
                    : "Visiting each competitor and mapping all page sections"}
                </div>
                <div className="loading-steps">
                  {loadingMessages[currentLoadingSet].map((msg, i) => (
                    <div key={i} className={`loading-step ${i < loadingStep ? "done" : i === loadingStep ? "active" : ""}`}>
                      {i < loadingStep ? "✓" : i === loadingStep ? "→" : "·"} {msg}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STAGE 1 RESULTS */}
            {(stage === "stage1-done" || stage === "stage2-loading" || stage === "stage2-done") && stage1Output && (
              <>
                <div className="report-header">
                  <div>
                    <h1>Competitor <em>Shortlist</em></h1>
                    <p>{clientName || "Client"} · {clientUrl}</p>
                  </div>
                  <div className="report-meta">
                    <span className="report-meta-pill">STAGE 1 COMPLETE</span>
                    <span className="report-meta-pill">{new Date().toLocaleDateString("en-GB")}</span>
                  </div>
                </div>

                <div className="section-label">Competitor Analysis</div>
                <div
                  className="output-content"
                  dangerouslySetInnerHTML={{ __html: stage1Output }}
                />

                <button className="download-btn" onClick={() => downloadReport(stage1Output, `${clientName || "client"}-competitors`)}>
                  ↓ Download Competitor Report
                </button>
              </>
            )}

            {/* STAGE 2 RESULTS */}
            {stage === "stage2-done" && stage2Output && (
              <>
                <div className="report-header" style={{ marginTop: "40px" }}>
                  <div>
                    <h1>Page Section <em>Recommendations</em></h1>
                    <p>{clientName || "Client"} · Homepage + Product Page</p>
                  </div>
                  <div className="report-meta">
                    <span className="report-meta-pill">STAGE 2 COMPLETE</span>
                    <span className="report-meta-pill">DESIGNER READY</span>
                  </div>
                </div>

                <div className="section-label">Section Recommendations</div>
                <div
                  className="output-content"
                  dangerouslySetInnerHTML={{ __html: stage2Output }}
                />

                <button className="download-btn" onClick={() => downloadReport(stage2Output, `${clientName || "client"}-page-recommendations`)}>
                  ↓ Download Recommendations Report
                </button>

                <div style={{ height: "40px" }} />
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
