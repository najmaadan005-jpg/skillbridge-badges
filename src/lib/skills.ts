// Generated: questions WITHOUT answers. Scoring happens in the database.
export type Question = { q: string; options: string[] };
export type Skill = { slug: SkillSlug; name: string; questions: Question[] };
export type SkillSlug = "web-development" | "bookkeeping" | "nursing-basics" | "customer-service";

export const SKILLS: Skill[] = [
  {
    "slug": "web-development",
    "name": "Web development",
    "questions": [
      {
        "q": "Which HTML element is best for the main navigation links of a site?",
        "options": [
          "<aside>",
          "<nav>",
          "<div>",
          "<section>"
        ]
      },
      {
        "q": "A button looks fine on desktop but overflows on phones. What should you add first?",
        "options": [
          "A larger font",
          "An !important rule",
          "A new HTML page",
          "A media query or flexible width"
        ]
      },
      {
        "q": "Which HTTP status code means the requested page was not found?",
        "options": [
          "301",
          "200",
          "500",
          "404"
        ]
      },
      {
        "q": "In JavaScript, what does `const` prevent?",
        "options": [
          "Declaring numbers",
          "Using the variable in functions",
          "Changing the object's properties",
          "Reassigning the variable"
        ]
      },
      {
        "q": "A form must send a password to the server. Which method should it use?",
        "options": [
          "HEAD",
          "GET",
          "POST",
          "OPTIONS"
        ]
      },
      {
        "q": "What is the main purpose of the `alt` attribute on an image?",
        "options": [
          "Add a border",
          "Set the image size",
          "Make the image load faster",
          "Describe the image for screen readers"
        ]
      },
      {
        "q": "Which CSS layout is best for placing items in a single row that wraps?",
        "options": [
          "float: left",
          "display: table",
          "display: flex with flex-wrap",
          "position: absolute"
        ]
      },
      {
        "q": "You changed CSS but the browser still shows the old style. What do you try first?",
        "options": [
          "Delete the database",
          "Hard refresh / clear cache",
          "Restart the server computer",
          "Rewrite the HTML"
        ]
      },
      {
        "q": "Which tool tracks changes to code and lets a team collaborate?",
        "options": [
          "Git",
          "Photoshop",
          "FTP",
          "Excel"
        ]
      },
      {
        "q": "Data from a user form will be saved in a database. What must you do?",
        "options": [
          "Validate and sanitize it",
          "Store it in a cookie",
          "Convert it to uppercase",
          "Trust it if it looks fine"
        ]
      }
    ]
  },
  {
    "slug": "bookkeeping",
    "name": "Bookkeeping",
    "questions": [
      {
        "q": "A business pays rent in cash. Which account decreases?",
        "options": [
          "Equity",
          "Revenue",
          "Cash",
          "Accounts payable"
        ]
      },
      {
        "q": "In double-entry bookkeeping, every transaction affects at least\u2026",
        "options": [
          "Only the bank account",
          "Two accounts",
          "Three accounts",
          "One account"
        ]
      },
      {
        "q": "A customer buys on credit. Which account increases?",
        "options": [
          "Expenses",
          "Cash",
          "Accounts receivable",
          "Accounts payable"
        ]
      },
      {
        "q": "What is the basic accounting equation?",
        "options": [
          "Assets = Revenue \u2212 Expenses",
          "Profit = Assets \u2212 Cash",
          "Assets = Liabilities + Equity",
          "Equity = Cash + Debt"
        ]
      },
      {
        "q": "The bank statement shows $50 less than your records because of a bank fee. What do you do?",
        "options": [
          "Record a bank charges expense",
          "Delete the transaction",
          "Increase revenue",
          "Ignore it"
        ]
      },
      {
        "q": "Which document proves a supplier asked you for payment?",
        "options": [
          "Receipt",
          "Invoice",
          "Payslip",
          "Bank card"
        ]
      },
      {
        "q": "Paying a supplier you owe money to reduces which account?",
        "options": [
          "Accounts receivable",
          "Inventory",
          "Accounts payable",
          "Revenue"
        ]
      },
      {
        "q": "A debit entry increases which type of account?",
        "options": [
          "Equity",
          "Liabilities",
          "Revenue",
          "Assets"
        ]
      },
      {
        "q": "What is a bank reconciliation for?",
        "options": [
          "Paying taxes",
          "Applying for a loan",
          "Calculating salaries",
          "Matching your records to the bank statement"
        ]
      },
      {
        "q": "Buying a delivery van for the business is recorded as\u2026",
        "options": [
          "A liability only",
          "A fixed asset",
          "Revenue",
          "An expense"
        ]
      }
    ]
  },
  {
    "slug": "nursing-basics",
    "name": "Nursing basics",
    "questions": [
      {
        "q": "What is the single most effective way to prevent infection spreading between patients?",
        "options": [
          "Wearing a mask only",
          "Opening windows",
          "Hand hygiene",
          "Giving antibiotics"
        ]
      },
      {
        "q": "A normal resting heart rate for a healthy adult is about\u2026",
        "options": [
          "60\u2013100 bpm",
          "30\u201350 bpm",
          "150\u2013180 bpm",
          "110\u2013140 bpm"
        ]
      },
      {
        "q": "Before giving any medication, you must first\u2026",
        "options": [
          "Warm the medicine",
          "Ask a visitor",
          "Crush the tablet",
          "Check the patient's identity"
        ]
      },
      {
        "q": "An adult patient suddenly collapses and is not breathing normally. Your first action?",
        "options": [
          "Wait to see if they wake",
          "Give water",
          "Take their temperature",
          "Call for help and start CPR"
        ]
      },
      {
        "q": "How often should a bed-bound patient usually be repositioned to prevent pressure sores?",
        "options": [
          "Once a week",
          "Every 2 hours",
          "Once a day",
          "Only when they ask"
        ]
      },
      {
        "q": "A normal adult body temperature is around\u2026",
        "options": [
          "40.0 \u00b0C",
          "37.0 \u00b0C",
          "38.5 \u00b0C",
          "35.0 \u00b0C"
        ]
      },
      {
        "q": "Used needles must be disposed of\u2026",
        "options": [
          "In a regular bin",
          "In a sharps container",
          "In the sink",
          "Recapped and reused"
        ]
      },
      {
        "q": "A patient is confused and has a fever. What should you do?",
        "options": [
          "Record it and report to the nurse or doctor",
          "Ignore it until tomorrow",
          "Give them food",
          "Tell them to rest only"
        ]
      },
      {
        "q": "What does the 'blood pressure' reading 120/80 represent?",
        "options": [
          "Oxygen/sugar",
          "Systolic/diastolic pressure",
          "Breaths/minute",
          "Pulse/temperature"
        ]
      },
      {
        "q": "When should you wear gloves?",
        "options": [
          "When contact with body fluids is possible",
          "Only when the patient asks",
          "Never in a clinic",
          "Only for surgery"
        ]
      }
    ]
  },
  {
    "slug": "customer-service",
    "name": "Customer service",
    "questions": [
      {
        "q": "An angry customer complains loudly. What should you do first?",
        "options": [
          "Call security immediately",
          "Listen calmly and acknowledge their frustration",
          "Walk away",
          "Argue back"
        ]
      },
      {
        "q": "You don't know the answer to a customer's question. Best response?",
        "options": [
          "Make up an answer",
          "Say you'll find out and follow up",
          "Say 'not my job'",
          "Ignore the question"
        ]
      },
      {
        "q": "What does 'first contact resolution' mean?",
        "options": [
          "Sending a survey first",
          "Solving the issue in the first interaction",
          "Answering the phone quickly",
          "Greeting the customer first"
        ]
      },
      {
        "q": "A customer emails at 8 pm. Your team's promise is a reply within 24 hours. When should you reply?",
        "options": [
          "Within a week",
          "Never",
          "Within 24 hours",
          "Only if they email again"
        ]
      },
      {
        "q": "Which phrase shows empathy?",
        "options": [
          "'I understand how frustrating this must be.'",
          "'Calm down.'",
          "'That's our policy.'",
          "'You should have read the terms.'"
        ]
      },
      {
        "q": "A product is out of stock. What is the most helpful response?",
        "options": [
          "Offer an alternative or a restock notification",
          "Tell them to try another shop",
          "Say no and end the chat",
          "Blame the warehouse"
        ]
      },
      {
        "q": "Why should you write notes after each customer conversation?",
        "options": [
          "To fill time",
          "To criticise the customer",
          "So colleagues can continue without asking again",
          "It is never needed"
        ]
      },
      {
        "q": "A customer asks for a refund outside policy. What do you do?",
        "options": [
          "Hang up",
          "Explain the policy politely and check options with a supervisor",
          "Ignore the request",
          "Promise a refund anyway"
        ]
      },
      {
        "q": "What is the best way to end a support call?",
        "options": [
          "Hang up immediately",
          "Confirm the issue is solved and ask if they need anything else",
          "Ask them to call back",
          "Transfer to another team"
        ]
      },
      {
        "q": "Which is a sign of good active listening?",
        "options": [
          "Interrupting with solutions",
          "Typing other emails meanwhile",
          "Speaking louder",
          "Repeating back the key problem to confirm"
        ]
      }
    ]
  }
];

export const PASS_PERCENT = 70;
export const skillName = (slug: string) => SKILLS.find((s) => s.slug === slug)?.name ?? slug;
