# DEPLOY_04_TELEGRAM_BOT_SETUP — BotFather + Mini App wiring (Staging + Prod)

## Why this matters
The Mini App opens through Telegram bot integration. Bot config mistakes cause "works on my phone" failures.

---

## A) Principle: Separate bots per environment (required)
- `@dope_staging_bot` -> staging web URL
- `@dope_prod_bot` -> production web URL

Use test environment for development rather than production.

---

## B) Create bot(s) via BotFather

### B1) Create bot
In @BotFather:
1) `/newbot`
2) Set name + username
3) Save token (store it only in backend secrets)

### B2) Create Mini App entity (optional but recommended)
In @BotFather:
1) `/newapp`
2) Link to your bot
3) You will get a direct link: `https://t.me/{bot}/{app}`

This allows opening without entering a 1:1 chat first (useful for distribution).

---

## C) Set the Menu Button (most common "open app" entry)
BotFather supports setting the bot menu button to open a web app URL via `/setmenubutton`.

Steps:
1) In @BotFather: `/setmenubutton`
2) Select your bot
3) Provide the HTTPS URL (staging or prod)
4) Provide the button title, e.g. `Open DOPE`

Expected result:
- When user opens chat with the bot, a menu button appears (bottom left) that launches your web app.

---

## D) Direct link entry (optional)
Direct-link Mini Apps use the `startapp` parameter, which is passed into the Mini App as `tgWebAppStartParam`.

Examples:
- `https://t.me/<botusername>/<appname>`
- `https://t.me/<botusername>/<appname>?startapp=ref_<code>`

Use `startapp` for:
- referral codes
- campaign attribution
- "resume activity" links

---

## E) Programmatic menu button (optional)
If you want to set the menu button via code, Telegram Bot API exposes `setChatMenuButton` for default or per-user menu button changes.

Use this only if you need dynamic per-user buttons. BotFather is simpler.

---

## F) Verification checklist (staging then prod)
- [ ] Open bot chat -> menu button appears -> opens the correct env URL
- [ ] Direct link `t.me/bot/app` opens the correct env URL (if using /newapp)
- [ ] `startapp` param reaches the frontend (log it once)
- [ ] Mini App loads without white screen

