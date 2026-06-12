import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Problem from "./models/Problem.js";

const PROBLEMS_DATA = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
      notes: [
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
      ],
    },
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "" },
      { input: "nums = [3,3], target = 6", output: "[0,1]", explanation: "" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹", "Only one valid answer exists"],
    functionName: "twoSum",
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your solution here\n\n}`,
      python: `def twoSum(nums, target):\n    # Write your solution here\n    pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n\n        return new int[0];\n    }\n}`,
    },
    testCases: [
      { input: "[[2,7,11,15], 9]", expectedOutput: "[0,1]", isHidden: false },
      { input: "[[3,2,4], 6]", expectedOutput: "[1,2]", isHidden: false },
      { input: "[[3,3], 6]", expectedOutput: "[0,1]", isHidden: false },
      { input: "[[1,5,3,7], 8]", expectedOutput: "[1,2]", isHidden: true },
      { input: "[[0,4,3,0], 0]", expectedOutput: "[0,3]", isHidden: true },
      { input: "[[-1,-2,-3,-4,-5], -8]", expectedOutput: "[2,4]", isHidden: true },
    ],
    expectedOutput: {
      javascript: "[0,1]\n[1,2]\n[0,1]",
      python: "[0, 1]\n[1, 2]\n[0, 1]",
      java: "[0, 1]\n[1, 2]\n[0, 1]",
    },
  },
  {
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Write a function that reverses a string. The input string is given as an array of characters s.",
      notes: ["You must do this by modifying the input array in-place with O(1) extra memory."],
    },
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: "" },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', explanation: "" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ascii character"],
    functionName: "reverseString",
    starterCode: {
      javascript: `function reverseString(s) {\n  // Write your solution here — modify s in-place\n\n}`,
      python: `def reverseString(s):\n    # Write your solution here — modify s in-place\n    pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public static void reverseString(char[] s) {\n        // Write your solution here — modify s in-place\n\n    }\n}`,
    },
    testCases: [
      { input: '[["h","e","l","l","o"]]', expectedOutput: '["o","l","l","e","h"]', isHidden: false },
      { input: '[["H","a","n","n","a","h"]]', expectedOutput: '["h","a","n","n","a","H"]', isHidden: false },
      { input: '[["A","b","c"]]', expectedOutput: '["c","b","A"]', isHidden: true },
      { input: '[["x"]]', expectedOutput: '["x"]', isHidden: true },
      { input: '[["a","b","c","d","e","f"]]', expectedOutput: '["f","e","d","c","b","a"]', isHidden: true },
    ],
    expectedOutput: {
      javascript: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
      python: "['o', 'l', 'l', 'e', 'h']\n['h', 'a', 'n', 'n', 'a', 'H']",
      java: "[o, l, l, e, h]\n[h, a, n, n, a, H]",
    },
  },
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
      notes: ["Given a string s, return true if it is a palindrome, or false otherwise."],
    },
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: "false", explanation: '"raceacar" is not a palindrome.' },
      { input: 's = " "', output: "true", explanation: 's is an empty string "" after removing non-alphanumeric characters.' },
    ],
    constraints: ["1 ≤ s.length ≤ 2 * 10⁵", "s consists only of printable ASCII characters"],
    functionName: "isPalindrome",
    starterCode: {
      javascript: `function isPalindrome(s) {\n  // Write your solution here\n\n}`,
      python: `def isPalindrome(s):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public static boolean isPalindrome(String s) {\n        // Write your solution here\n\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: '["A man, a plan, a canal: Panama"]', expectedOutput: "true", isHidden: false },
      { input: '["race a car"]', expectedOutput: "false", isHidden: false },
      { input: '[" "]', expectedOutput: "true", isHidden: false },
      { input: '["Was it a car or a cat I saw?"]', expectedOutput: "true", isHidden: true },
      { input: '["no"]', expectedOutput: "false", isHidden: true },
      { input: '["0P"]', expectedOutput: "false", isHidden: true },
    ],
    expectedOutput: {
      javascript: "true\nfalse\ntrue",
      python: "True\nFalse\nTrue",
      java: "true\nfalse\ntrue",
    },
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      notes: [],
    },
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1", explanation: "The subarray [1] has the largest sum 1." },
      { input: "nums = [5,4,-1,7,8]", output: "23", explanation: "The subarray [5,4,-1,7,8] has the largest sum 23." },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    functionName: "maxSubArray",
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Write your solution here\n\n}`,
      python: `def maxSubArray(nums):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public static int maxSubArray(int[] nums) {\n        // Write your solution here\n\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "[[-2,1,-3,4,-1,2,1,-5,4]]", expectedOutput: "6", isHidden: false },
      { input: "[[1]]", expectedOutput: "1", isHidden: false },
      { input: "[[5,4,-1,7,8]]", expectedOutput: "23", isHidden: false },
      { input: "[[-1]]", expectedOutput: "-1", isHidden: true },
      { input: "[[-2,-1]]", expectedOutput: "-1", isHidden: true },
      { input: "[[1,2,3,4,5]]", expectedOutput: "15", isHidden: true },
      { input: "[[-2,1]]", expectedOutput: "1", isHidden: true },
    ],
    expectedOutput: {
      javascript: "6\n1\n23",
      python: "6\n1\n23",
      java: "6\n1\n23",
    },
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).",
      notes: [
        "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
        "Return the maximum amount of water a container can store.",
        "Notice that you may not slant the container.",
      ],
    },
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. The max area of water the container can contain is 49." },
      { input: "height = [1,1]", output: "1", explanation: "" },
    ],
    constraints: ["n == height.length", "2 ≤ n ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"],
    functionName: "maxArea",
    starterCode: {
      javascript: `function maxArea(height) {\n  // Write your solution here\n\n}`,
      python: `def maxArea(height):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public static int maxArea(int[] height) {\n        // Write your solution here\n\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "[[1,8,6,2,5,4,8,3,7]]", expectedOutput: "49", isHidden: false },
      { input: "[[1,1]]", expectedOutput: "1", isHidden: false },
      { input: "[[4,3,2,1,4]]", expectedOutput: "16", isHidden: true },
      { input: "[[1,2,1]]", expectedOutput: "2", isHidden: true },
      { input: "[[2,3,4,5,18,17,6]]", expectedOutput: "17", isHidden: true },
    ],
    expectedOutput: {
      javascript: "49\n1",
      python: "49\n1",
      java: "49\n1",
    },
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Connected to MongoDB");

    // 1. Create admin user
    const existingAdmin = await User.findOne({ email: "admin@talentiq.com" });
    let adminUser;

    if (existingAdmin) {
      console.log("⚡ Admin user already exists, skipping...");
      adminUser = existingAdmin;
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      adminUser = await User.create({
        name: "Admin",
        email: "admin@talentiq.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Admin user created (admin@talentiq.com / admin123)");
    }

    // 2. Seed problems — drop existing and re-seed with updated schema
    await Problem.deleteMany({});
    console.log("🗑️  Cleared existing problems");

    const problemsWithCreator = PROBLEMS_DATA.map((p) => ({
      ...p,
      createdBy: adminUser._id,
    }));

    await Problem.insertMany(problemsWithCreator);
    console.log(`✅ ${PROBLEMS_DATA.length} problems seeded successfully (with test cases)`);

    console.log("\n🎉 Seed completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
}

seed();
