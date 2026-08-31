/**
 * The question catalog.
 *
 * Each pattern is an object with a `questions` array. To add a question,
 * append one line to the right array:
 *
 *   { slug: "rotate-array", title: "Rotate Array", difficulty: "Medium" }
 *
 * `slug` is the last segment of the LeetCode URL. The full link is built by
 * `leetcodeUrl()` below. Solutions are stored separately in IndexedDB, keyed by
 * `${pattern.id}/${question.slug}`, so you can freely add, reorder or rename
 * questions without losing saved work. Changing a `slug` orphans its entry.
 */

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

/** A question exactly as it is written in the catalog below. */
export interface PatternQuestion {
  slug: string;
  title: string;
  difficulty: Difficulty;
  /** Only needed when a question does not live at the usual LeetCode URL. */
  url?: string;
}

export interface Pattern {
  id: string;
  name: string;
  idea: string;
  questions: PatternQuestion[];
}

export const PATTERNS: Pattern[] = [
  {
    id: "two-pointers",
    name: "Two Pointers",
    idea: "Walk two indices toward each other, or one behind the other, so a sorted array gives up its answer in a single pass.",
    questions: [
      { slug: "valid-palindrome", title: "Valid Palindrome", difficulty: "Easy" },
      { slug: "remove-duplicates-from-sorted-array", title: "Remove Duplicates from Sorted Array", difficulty: "Easy" },
      { slug: "two-sum-ii-input-array-is-sorted", title: "Two Sum II — Input Array Is Sorted", difficulty: "Medium" },
      { slug: "3sum", title: "3Sum", difficulty: "Medium" },
      { slug: "container-with-most-water", title: "Container With Most Water", difficulty: "Medium" },
      { slug: "sort-colors", title: "Sort Colors", difficulty: "Medium" },
      { slug: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard" },
    ],
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    idea: "Keep a window over the array, grow it from the right, shrink from the left the moment it breaks the rule.",
    questions: [
      { slug: "best-time-to-buy-and-sell-stock", title: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
      { slug: "maximum-average-subarray-i", title: "Maximum Average Subarray I", difficulty: "Easy" },
      { slug: "longest-substring-without-repeating-characters", title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
      { slug: "longest-repeating-character-replacement", title: "Longest Repeating Character Replacement", difficulty: "Medium" },
      { slug: "permutation-in-string", title: "Permutation in String", difficulty: "Medium" },
      { slug: "minimum-window-substring", title: "Minimum Window Substring", difficulty: "Hard" },
      { slug: "sliding-window-maximum", title: "Sliding Window Maximum", difficulty: "Hard" },
    ],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    idea: "Halve the search space each step. Works on sorted data, and on any answer range where a predicate flips once from false to true.",
    questions: [
      { slug: "binary-search", title: "Binary Search", difficulty: "Easy" },
      { slug: "search-insert-position", title: "Search Insert Position", difficulty: "Easy" },
      { slug: "search-a-2d-matrix", title: "Search a 2D Matrix", difficulty: "Medium" },
      { slug: "koko-eating-bananas", title: "Koko Eating Bananas", difficulty: "Medium" },
      { slug: "find-minimum-in-rotated-sorted-array", title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium" },
      { slug: "search-in-rotated-sorted-array", title: "Search in Rotated Sorted Array", difficulty: "Medium" },
      { slug: "capacity-to-ship-packages-within-d-days", title: "Capacity to Ship Packages Within D Days", difficulty: "Medium" },
      { slug: "median-of-two-sorted-arrays", title: "Median of Two Sorted Arrays", difficulty: "Hard" },
    ],
  },
  {
    id: "hashing",
    name: "Hashing",
    idea: "Trade memory for time. A map or a set turns a nested loop into one pass.",
    questions: [
      { slug: "two-sum", title: "Two Sum", difficulty: "Easy" },
      { slug: "contains-duplicate", title: "Contains Duplicate", difficulty: "Easy" },
      { slug: "valid-anagram", title: "Valid Anagram", difficulty: "Easy" },
      { slug: "group-anagrams", title: "Group Anagrams", difficulty: "Medium" },
      { slug: "top-k-frequent-elements", title: "Top K Frequent Elements", difficulty: "Medium" },
      { slug: "subarray-sum-equals-k", title: "Subarray Sum Equals K", difficulty: "Medium" },
      { slug: "longest-consecutive-sequence", title: "Longest Consecutive Sequence", difficulty: "Medium" },
    ],
  },
  {
    id: "prefix-sum",
    name: "Prefix Sum",
    idea: "Precompute running totals once so any range query becomes a subtraction.",
    questions: [
      { slug: "running-sum-of-1d-array", title: "Running Sum of 1d Array", difficulty: "Easy" },
      { slug: "find-pivot-index", title: "Find Pivot Index", difficulty: "Easy" },
      { slug: "range-sum-query-immutable", title: "Range Sum Query — Immutable", difficulty: "Easy" },
      { slug: "product-of-array-except-self", title: "Product of Array Except Self", difficulty: "Medium" },
      { slug: "contiguous-array", title: "Contiguous Array", difficulty: "Medium" },
      { slug: "range-sum-query-2d-immutable", title: "Range Sum Query 2D — Immutable", difficulty: "Medium" },
    ],
  },
  {
    id: "stack",
    name: "Stack & Monotonic Stack",
    idea: "Hold elements until you meet the one that resolves them. A stack kept in order answers next-greater questions in linear time.",
    questions: [
      { slug: "valid-parentheses", title: "Valid Parentheses", difficulty: "Easy" },
      { slug: "next-greater-element-i", title: "Next Greater Element I", difficulty: "Easy" },
      { slug: "min-stack", title: "Min Stack", difficulty: "Medium" },
      { slug: "evaluate-reverse-polish-notation", title: "Evaluate Reverse Polish Notation", difficulty: "Medium" },
      { slug: "daily-temperatures", title: "Daily Temperatures", difficulty: "Medium" },
      { slug: "car-fleet", title: "Car Fleet", difficulty: "Medium" },
      { slug: "largest-rectangle-in-histogram", title: "Largest Rectangle in Histogram", difficulty: "Hard" },
    ],
  },
  {
    id: "linked-list",
    name: "Linked List",
    idea: "Pointer surgery. Dummy heads, fast and slow runners, and careful reversal cover almost everything here.",
    questions: [
      { slug: "reverse-linked-list", title: "Reverse Linked List", difficulty: "Easy" },
      { slug: "merge-two-sorted-lists", title: "Merge Two Sorted Lists", difficulty: "Easy" },
      { slug: "linked-list-cycle", title: "Linked List Cycle", difficulty: "Easy" },
      { slug: "middle-of-the-linked-list", title: "Middle of the Linked List", difficulty: "Easy" },
      { slug: "remove-nth-node-from-end-of-list", title: "Remove Nth Node From End of List", difficulty: "Medium" },
      { slug: "add-two-numbers", title: "Add Two Numbers", difficulty: "Medium" },
      { slug: "reorder-list", title: "Reorder List", difficulty: "Medium" },
      { slug: "copy-list-with-random-pointer", title: "Copy List with Random Pointer", difficulty: "Medium" },
      { slug: "merge-k-sorted-lists", title: "Merge k Sorted Lists", difficulty: "Hard" },
    ],
  },
  {
    id: "trees",
    name: "Trees & BST",
    idea: "Most tree problems are one recursive function that returns something useful from each subtree.",
    questions: [
      { slug: "invert-binary-tree", title: "Invert Binary Tree", difficulty: "Easy" },
      { slug: "maximum-depth-of-binary-tree", title: "Maximum Depth of Binary Tree", difficulty: "Easy" },
      { slug: "diameter-of-binary-tree", title: "Diameter of Binary Tree", difficulty: "Easy" },
      { slug: "balanced-binary-tree", title: "Balanced Binary Tree", difficulty: "Easy" },
      { slug: "same-tree", title: "Same Tree", difficulty: "Easy" },
      { slug: "lowest-common-ancestor-of-a-binary-search-tree", title: "Lowest Common Ancestor of a BST", difficulty: "Medium" },
      { slug: "binary-tree-level-order-traversal", title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
      { slug: "validate-binary-search-tree", title: "Validate Binary Search Tree", difficulty: "Medium" },
      { slug: "kth-smallest-element-in-a-bst", title: "Kth Smallest Element in a BST", difficulty: "Medium" },
      { slug: "binary-tree-maximum-path-sum", title: "Binary Tree Maximum Path Sum", difficulty: "Hard" },
      { slug: "serialize-and-deserialize-binary-tree", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard" },
    ],
  },
  {
    id: "graphs",
    name: "Graphs / BFS / DFS",
    idea: "Grids are graphs too. Pick BFS for shortest hops, DFS for reachability and components.",
    questions: [
      { slug: "number-of-islands", title: "Number of Islands", difficulty: "Medium" },
      { slug: "max-area-of-island", title: "Max Area of Island", difficulty: "Medium" },
      { slug: "clone-graph", title: "Clone Graph", difficulty: "Medium" },
      { slug: "rotting-oranges", title: "Rotting Oranges", difficulty: "Medium" },
      { slug: "pacific-atlantic-water-flow", title: "Pacific Atlantic Water Flow", difficulty: "Medium" },
      { slug: "course-schedule", title: "Course Schedule", difficulty: "Medium" },
      { slug: "course-schedule-ii", title: "Course Schedule II", difficulty: "Medium" },
      { slug: "word-ladder", title: "Word Ladder", difficulty: "Hard" },
    ],
  },
  {
    id: "backtracking",
    name: "Backtracking",
    idea: "Choose, recurse, undo the choice. The undo step is where most bugs live.",
    questions: [
      { slug: "subsets", title: "Subsets", difficulty: "Medium" },
      { slug: "combination-sum", title: "Combination Sum", difficulty: "Medium" },
      { slug: "permutations", title: "Permutations", difficulty: "Medium" },
      { slug: "generate-parentheses", title: "Generate Parentheses", difficulty: "Medium" },
      { slug: "letter-combinations-of-a-phone-number", title: "Letter Combinations of a Phone Number", difficulty: "Medium" },
      { slug: "word-search", title: "Word Search", difficulty: "Medium" },
      { slug: "palindrome-partitioning", title: "Palindrome Partitioning", difficulty: "Medium" },
      { slug: "n-queens", title: "N-Queens", difficulty: "Hard" },
    ],
  },
  {
    id: "greedy",
    name: "Greedy",
    idea: "Take the locally best move and prove it never costs you later. If the proof feels shaky, it is probably a DP problem.",
    questions: [
      { slug: "maximum-subarray", title: "Maximum Subarray", difficulty: "Medium" },
      { slug: "jump-game", title: "Jump Game", difficulty: "Medium" },
      { slug: "jump-game-ii", title: "Jump Game II", difficulty: "Medium" },
      { slug: "gas-station", title: "Gas Station", difficulty: "Medium" },
      { slug: "hand-of-straights", title: "Hand of Straights", difficulty: "Medium" },
      { slug: "partition-labels", title: "Partition Labels", difficulty: "Medium" },
      { slug: "merge-triplets-to-form-target-triplet", title: "Merge Triplets to Form Target Triplet", difficulty: "Medium" },
    ],
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    idea: "Name the state, write the transition, decide the order you fill it in. Memoize first, flatten to a table later if you care.",
    questions: [
      { slug: "climbing-stairs", title: "Climbing Stairs", difficulty: "Easy" },
      { slug: "min-cost-climbing-stairs", title: "Min Cost Climbing Stairs", difficulty: "Easy" },
      { slug: "house-robber", title: "House Robber", difficulty: "Medium" },
      { slug: "house-robber-ii", title: "House Robber II", difficulty: "Medium" },
      { slug: "coin-change", title: "Coin Change", difficulty: "Medium" },
      { slug: "longest-increasing-subsequence", title: "Longest Increasing Subsequence", difficulty: "Medium" },
      { slug: "longest-palindromic-substring", title: "Longest Palindromic Substring", difficulty: "Medium" },
      { slug: "word-break", title: "Word Break", difficulty: "Medium" },
      { slug: "unique-paths", title: "Unique Paths", difficulty: "Medium" },
      { slug: "longest-common-subsequence", title: "Longest Common Subsequence", difficulty: "Medium" },
      { slug: "edit-distance", title: "Edit Distance", difficulty: "Medium" },
    ],
  },
  {
    id: "heap",
    name: "Heap / Priority Queue",
    idea: "When you only ever need the smallest or largest right now, a heap beats sorting the whole thing.",
    questions: [
      { slug: "last-stone-weight", title: "Last Stone Weight", difficulty: "Easy" },
      { slug: "kth-largest-element-in-a-stream", title: "Kth Largest Element in a Stream", difficulty: "Easy" },
      { slug: "k-closest-points-to-origin", title: "K Closest Points to Origin", difficulty: "Medium" },
      { slug: "kth-largest-element-in-an-array", title: "Kth Largest Element in an Array", difficulty: "Medium" },
      { slug: "task-scheduler", title: "Task Scheduler", difficulty: "Medium" },
      { slug: "design-twitter", title: "Design Twitter", difficulty: "Medium" },
      { slug: "find-median-from-data-stream", title: "Find Median from Data Stream", difficulty: "Hard" },
    ],
  },
  {
    id: "intervals",
    name: "Intervals",
    idea: "Sort by start or by end, then sweep once and ask whether the current interval overlaps the last one you kept.",
    questions: [
      { slug: "meeting-rooms", title: "Meeting Rooms", difficulty: "Easy" },
      { slug: "insert-interval", title: "Insert Interval", difficulty: "Medium" },
      { slug: "merge-intervals", title: "Merge Intervals", difficulty: "Medium" },
      { slug: "non-overlapping-intervals", title: "Non-overlapping Intervals", difficulty: "Medium" },
      { slug: "meeting-rooms-ii", title: "Meeting Rooms II", difficulty: "Medium" },
      { slug: "minimum-interval-to-include-each-query", title: "Minimum Interval to Include Each Query", difficulty: "Hard" },
    ],
  },
  {
    id: "bit-manipulation",
    name: "Bit Manipulation",
    idea: "XOR cancels pairs, n & (n - 1) clears the lowest set bit, and shifting is your loop counter.",
    questions: [
      { slug: "single-number", title: "Single Number", difficulty: "Easy" },
      { slug: "number-of-1-bits", title: "Number of 1 Bits", difficulty: "Easy" },
      { slug: "counting-bits", title: "Counting Bits", difficulty: "Easy" },
      { slug: "reverse-bits", title: "Reverse Bits", difficulty: "Easy" },
      { slug: "missing-number", title: "Missing Number", difficulty: "Easy" },
      { slug: "sum-of-two-integers", title: "Sum of Two Integers", difficulty: "Medium" },
      { slug: "reverse-integer", title: "Reverse Integer", difficulty: "Medium" },
    ],
  },
  {
    id: "union-find",
    name: "Union Find",
    idea: "Merge sets and ask which set something belongs to. Path compression plus union by rank keeps it near constant time.",
    questions: [
      { slug: "number-of-provinces", title: "Number of Provinces", difficulty: "Medium" },
      { slug: "number-of-connected-components-in-an-undirected-graph", title: "Number of Connected Components in an Undirected Graph", difficulty: "Medium" },
      { slug: "graph-valid-tree", title: "Graph Valid Tree", difficulty: "Medium" },
      { slug: "redundant-connection", title: "Redundant Connection", difficulty: "Medium" },
      { slug: "accounts-merge", title: "Accounts Merge", difficulty: "Medium" },
      { slug: "most-stones-removed-with-same-row-or-column", title: "Most Stones Removed with Same Row or Column", difficulty: "Medium" },
    ],
  },
  {
    id: "tries",
    name: "Tries",
    idea: "A tree keyed by characters. Prefix questions that look expensive become a walk down one path.",
    questions: [
      { slug: "longest-common-prefix", title: "Longest Common Prefix", difficulty: "Easy" },
      { slug: "implement-trie-prefix-tree", title: "Implement Trie (Prefix Tree)", difficulty: "Medium" },
      { slug: "design-add-and-search-words-data-structure", title: "Design Add and Search Words Data Structure", difficulty: "Medium" },
      { slug: "replace-words", title: "Replace Words", difficulty: "Medium" },
      { slug: "maximum-xor-of-two-numbers-in-an-array", title: "Maximum XOR of Two Numbers in an Array", difficulty: "Medium" },
      { slug: "word-search-ii", title: "Word Search II", difficulty: "Hard" },
    ],
  },
];

export const leetcodeUrl = (slug: string): string =>
  `https://leetcode.com/problems/${slug}/`;
