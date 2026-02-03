# Scripts Directory Index

Welcome to the poll activity generation scripts! This directory contains tools for simulating user engagement on your polls.

## 📁 Files in This Directory

### 🔧 Executable Scripts

| File | Purpose | Lines | Documentation |
|------|---------|-------|---------------|
| **`generate-activity.ts`** | Generate votes + comments | 370 | Main comprehensive tool |
| **`simulate-votes.ts`** | Generate votes only | 150 | Fast vote generator |

### 📚 Documentation

| File | Purpose | When to Read |
|------|---------|--------------|
| **`QUICKSTART.md`** | 60-second guide | Start here! First time using scripts |
| **`README.md`** | Complete documentation | Learn all features and options |
| **`EXAMPLES.md`** | Real-world use cases | See practical examples |
| **`SUMMARY.md`** | Technical deep-dive | Understand how it works |
| **`INDEX.md`** | This file | Navigate the docs |

---

## 🎯 Which File Should I Read?

### I'm in a hurry, just want to generate some activity
→ **`QUICKSTART.md`** (2 minutes read)

### I want to learn all the options and features
→ **`README.md`** (10 minutes read)

### I need examples for specific scenarios
→ **`EXAMPLES.md`** (5 minutes read)

### I want to understand the technical implementation
→ **`SUMMARY.md`** (8 minutes read)

### I'm lost and need an overview
→ **`INDEX.md`** (you're here!)

---

## 🚀 Quick Command Reference

```bash
# Most common commands
npm run generate-activity <poll-slug>
npm run simulate-votes <poll-slug>

# With options
npm run generate-activity <poll-slug> --votes 50 --comments 20
npm run simulate-votes <poll-slug> 100

# Get help
npm run generate-activity
npm run simulate-votes
```

---

## 📊 Script Comparison

| Feature | `generate-activity.ts` | `simulate-votes.ts` |
|---------|----------------------|-------------------|
| **Votes** | ✅ Yes | ✅ Yes |
| **Comments** | ✅ Yes | ❌ No |
| **Speed** | Moderate | Fast |
| **Flexibility** | High | Medium |
| **Best For** | Demos, full tests | Load tests, quick tests |

---

## 📖 Documentation Overview

### QUICKSTART.md
- **Length**: ~150 lines
- **Reading Time**: 2 minutes
- **Content**: 
  - How to get started in 3 steps
  - Common commands
  - Troubleshooting basics
  - Quick examples

### README.md  
- **Length**: ~400 lines
- **Reading Time**: 10 minutes
- **Content**:
  - Complete feature list
  - All command options
  - Detailed troubleshooting
  - Technical specifications
  - Tips and best practices

### EXAMPLES.md
- **Length**: ~300 lines  
- **Reading Time**: 5 minutes
- **Content**:
  - 15+ real-world scenarios
  - Multi-poll strategies
  - Use case demonstrations
  - Command patterns
  - Advanced techniques

### SUMMARY.md
- **Length**: ~450 lines
- **Reading Time**: 8 minutes  
- **Content**:
  - Architecture overview
  - Implementation details
  - Performance metrics
  - Code explanations
  - Maintenance guide

---

## 🎓 Learning Path

### Beginner
1. Read `QUICKSTART.md`
2. Try the basic commands
3. Check `EXAMPLES.md` for your use case

### Intermediate
1. Read `README.md` thoroughly
2. Experiment with different options
3. Try multi-poll scenarios from `EXAMPLES.md`

### Advanced
1. Read `SUMMARY.md` for technical details
2. Modify scripts for custom needs
3. Integrate into CI/CD pipelines

---

## 💡 Common Use Cases → Documentation

| What I Want to Do | Read This |
|-------------------|-----------|
| Generate activity for first time | `QUICKSTART.md` |
| Prepare for a demo | `EXAMPLES.md` → "Before a Demo" |
| Load test my poll | `EXAMPLES.md` → "Load Testing" |
| Test comment functionality | `README.md` → "Features" |
| Understand the code | `SUMMARY.md` → "Technical Details" |
| Fix an error | `README.md` → "Troubleshooting" |
| See all available options | `README.md` → "Options" |
| Get inspired by examples | `EXAMPLES.md` |

---

## 🔍 Feature Finder

Looking for specific features? Here's where to find them:

**Comment Templates**
- Where: `generate-activity.ts` lines 50-80
- Docs: `SUMMARY.md` → "Extending Comment Templates"

**Rate Limiting**
- Where: Both scripts, delay functions
- Docs: `README.md` → "Rate Limiting"

**Progress Tracking**
- Where: Both scripts, progress loops
- Docs: `SUMMARY.md` → "Progress Tracking"

**Fingerprint Generation**
- Where: Both scripts, `generateFingerprint()`
- Docs: `SUMMARY.md` → "Unique Fingerprints"

**Error Handling**
- Where: Both scripts, try/catch blocks
- Docs: `README.md` → "Troubleshooting"

---

## 📞 Getting Help

### Quick Issues
1. Check `README.md` → Troubleshooting
2. Verify your poll slug
3. Check `.env.local` has `VITE_CONVEX_URL`

### Understanding Scripts
1. Read `SUMMARY.md` → "How It Works"
2. Look at the source code
3. Check inline comments

### Use Case Questions
1. Browse `EXAMPLES.md`
2. Try similar commands
3. Adapt to your needs

---

## 🎯 Success Metrics

After using these scripts, you should be able to:
- ✅ Generate test data in under 1 minute
- ✅ Create realistic poll engagement
- ✅ Load test with hundreds of votes  
- ✅ Prepare professional demos
- ✅ Test UI with varied content
- ✅ Troubleshoot common issues

---

## 📦 What's Included

```
scripts/
├── generate-activity.ts    # Main comprehensive script
├── simulate-votes.ts       # Fast vote generator
├── QUICKSTART.md          # 60-second start guide
├── README.md              # Complete documentation
├── EXAMPLES.md            # Real-world use cases
├── SUMMARY.md             # Technical deep-dive
└── INDEX.md               # This navigation file
```

**Total Documentation**: ~1,500 lines  
**Total Scripts**: ~520 lines of TypeScript  
**Total Project**: ~2,000 lines of code + docs

---

## 🚦 Quick Start Reminder

New here? Follow these steps:

1. **Read**: `QUICKSTART.md` (2 min)
2. **Run**: `npm run generate-activity <your-poll-slug>`
3. **Check**: Refresh poll in browser
4. **Learn**: Browse other docs as needed

---

## 🎉 You're All Set!

Everything you need is in this directory:
- ✅ Two powerful scripts
- ✅ Comprehensive documentation  
- ✅ Real-world examples
- ✅ Technical deep-dives
- ✅ Quick reference guides

Pick your starting point and dive in!

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Status**: Production Ready ✨
