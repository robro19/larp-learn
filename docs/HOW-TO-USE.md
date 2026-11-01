# How to use Larp Club

**[Open the app](https://larp-learn.onrender.com/) · [Watch the demo](https://larp-learn.onrender.com/demo.html) · [Download the MP4](../public/demo/larp-club-demo.mp4?raw=true)**

No sign-up, payment, or API key is needed to play. Use a recent desktop or phone browser.

## 1. Play your first role

1. Open **Larp Lounge**, then choose **Founder for a day**. You can also choose any role under **Play a Role**.
2. Read the situation, choose a reply, and press **Commit to the bit**.
3. A wrong reply gets a consequence and explanation. Pick another reply and try again.
4. When asked to scope the product, select exactly two items. Tap a selected item again to remove it.
5. Use **Break character · ask Larpy** whenever you want a hint.
6. In the request lab, choose **GET**, enter **/demo-snacks**, and press **Send real request**. The app calls a real demo server. Try POST for a 405 response or the outage preset for a deliberate 503, then recover with GET /demo-snacks.
7. Finish the remaining scenes and open your skills debrief. Replaying a solved scene does not award more XP.

The founder role has six scenes; **Production is on fire** and **AI visionary, under questioning** each have four. All scenarios are fictional; the skills explanations are real. The job titles are jokes, not qualifications.

## 2. Try the Hot Seat

1. Open **Larp Kit → The Hot Seat**.
2. Send **GET /demo-inventory**. A successful request produces fresh sample inventory.
3. Read the latest response. Type its success status code, the sum of all stock values, and the number of snacks whose stock is zero.
4. Press **Present the facts**. If a value is wrong, use the feedback and try again.
5. Choose **Try a fresh inventory** for a different round.

There are no answer choices. The answers are checked against the response you actually fetched.

## 3. Play with friends or judges

1. On the lounge, choose **Start a group challenge**. Alternatively open **Larp Kit → Bring the group chat**.
2. Press **Create a room**. Share its eight-character code, copy its invite link, or let people scan the QR code.
3. Players open the invite on their own phones or browsers. Two tabs in the same browser share a guest identity; use separate devices or browser profiles for different players.
4. Everyone receives the same inventory. Submit the HTTP success code, total units, and sold-out snack count.
5. A correct first attempt earns 100 points, a second earns 75, and a third earns 50. A correct answer locks your score; three wrong attempts end that round.
6. Press **Refresh results** to see new submissions. Refreshing results preserves answers you are still typing.
7. Use **Switch room** to join another room. The active room is reflected in the invite URL, so a page refresh reopens it.

Rooms accept answers for six hours. The board shows generated nicknames rather than real names or emails. Anyone with an invite can see that room's inventory and board. Scores are checked by the backend. Room creation is limited to three per guest per day.

## 4. Use the rest of the Larp Kit

- **Pitch machine:** describe an imaginary startup, pick a level of founder energy, and generate or copy a pitch. This uses local templates, not an AI model.
- **Stand-up survival:** answer three meeting questions. Choose the grounded replies to earn its achievement.
- **Buzzword decoder:** select a term for a plain-English definition and a useful example.
- **Alter ego studio:** change your fictional role and job title.
- **My Alter Ego:** view XP, completed roles, achievements, and Hot Seat completions.

## 5. Email your skills receipt

1. Finish any complete role or the original API practice mission.
2. Open its debrief or **My Alter Ego → Email my receipt**.
3. Enter your own email and tick the one-time delivery consent box.
4. Press **Email my receipt**. The Agentboxd email includes completed roles and their practised skills.

This does not subscribe you to a mailing list. Requests are limited to one per guest/recipient per day, with a daily service cap. “Queued” means the provider accepted the request; check your inbox and spam folder for delivery.

## Progress and troubleshooting

- Progress saves on this device and syncs to the backend when connected. Completed achievements are merged so local and cloud records do not replace each other.
- Your guest identity belongs to this browser. Clearing site data or moving to another device does not transfer that identity. There is no email login or cross-device account.
- If the connection fails, keep your browser data, check the network, and refresh. Local progress remains available.
- A **405** means the method is unsupported; use GET for these reading exercises. **404** means the path was not found. The outage preset deliberately returns **503**.
- If a room expires, switch rooms and create or join a new one.
- If email was already requested today, check your inbox rather than submitting repeatedly.

## Run the source locally

Install Node.js 20 or newer, then:

```sh
git clone https://github.com/robro19/larp-learn.git
cd larp-learn
npm start
```

Open **http://localhost:3000**. Run `npm test` for the eight automated tests.

The local static UI needs no package dependencies. The shared deployed backend permits the production Render origin, so use the [live app](https://larp-learn.onrender.com/) for network exercises, room play, and email. To run a fully independent fork, deploy `backend/schema.sql`, `backend/rooms.sql`, and the Edge Function to your own Supabase project; change the public API URL/key and allowed origin. Store Agentboxd credentials only in backend secrets. Details are in the [README](../README.md).
