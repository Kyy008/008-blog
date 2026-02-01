---
title: 2026第二次蓝桥赛制个人赛题解
published: 2026-02-01
description: 蓝桥杯第二次个人训练赛
image: ./cover.webp
tags:
  - 算法竞赛
category: 算法竞赛
draft: false
---
不是很喜欢本场的题，一水二水都是红题难度，而五水直接飞升到上位蓝题 :spoiler[切蓝题,到底是什么感觉...]。因此本次题解只记录有价值的三水和四水题

# E. Align(通过人数 22/59)

### 题目描述

给定 $N$ 个整数 $A_1, A_2, \dots, A_N$。你需要将这些整数重新排列成一行，使得相邻元素绝对值之和最大。求最大值。

### 输入格式

第一行包含一个整数 $N$。
接下来 $N$ 行，每行包含一个整数 $A_i$。

- $2 \leqslant N \leqslant 10^5$
- $1 \leqslant A_i \leqslant 10^9$
- 输入均为整数

### 题解

考虑贪心策略。为了让相邻元素的差的绝对值之和最大，我们应该尽量让较大的数和较小的数相邻，即呈现“大、小、大、小...”的交替排列。

我的思路是：首先找出整个数组的最小值和最大值，让他俩排成一队（假设最小值是队头，最大值是队尾）。然后循环以下操作：我们从剩余的数中挑出两个数，第一个是和队头相差最大的数，第二个是和队尾相差最大的数，我们比较哪个相差的更大。如果是前者更大，我们就把那个数放到队头；如果后者更大，我们就把那个数放到队尾。这样以来我们可以贪心地保证，大小交替的幅度必然最大。

维护这个过程也很简单，不难发现这个队列需要两头进，自然想到用双端队列 `deque`来维护了～

我们维护一个双端队列 `a` 来存放剩余的数，初始时将所有数从小到大排序后放入。再维护一个双端队列 `b` 来存放结果序列，这样以来过程就是不断的比较`a` 的首尾和`b`的首尾差的最大值，然后再不断地从`a`中取出，再放到`b`就好了

时间复杂度主要在于排序，为 $O(N \log N)$。

```cpp
#include<bits/stdc++.h> 
using namespace std; 
#define int long long 
#define endl '\n' 
#define rep(i, f, l) for(int i(f); i <= l; ++i) 
#define per(i, f, l) for(int i(f); i >= l; --i) 
const int N = 2e5 + 5; 
int num[N]; 
deque<int> a; 
deque<int> b; 
void work() { 
	 int n; 
     cin >> n; 
     rep(i, 1, n) cin >> num[i]; 
     sort(num + 1, num + n + 1); 
     rep(i, 1, n) a.push_back(num[i]); 
     b.push_back(a.front()); 
     a.pop_front(); 
     int ans = 0; 
     while(!a.empty()){ 
         int x1 = abs(a.front() - b.front()); 
         int x2 = abs(a.back() - b.front()); 
         int x3 = abs(a.front() - b.back()); 
         int x4 = abs(a.back() - b.back()); 
         int mx = max({x1, x2, x3, x4}); 
         ans += mx; 
         if(mx == x1){ 
             b.push_front(a.front()); 
             a.pop_front(); 
         } else if(mx == x2){ 
             b.push_front(a.back()); 
             a.pop_back(); 
         } else if(mx == x3){ 
             b.push_back(a.front()); 
             a.pop_front(); 
         } else{ 
             b.push_back(a.back()); 
             a.pop_back(); 
         } 
     } 
 	 cout << ans << endl; 
 	 return; 
 } 
 signed main() { 
 	 ios::sync_with_stdio(0); 
 	 cin.tie(0); 
 	 cout.tie(0); 
 	 int t = 1; 
 // 	 cin >> t; 
 	 while (t--) { 
 	 	 work(); 
 	 } 
 	 return 0; 
 }
```


# A. Crossing(通过人数 21/59)

### 题目描述

给定一个整数 $N$。判断是否存在 $k$ 个集合 $S_1, S_2, \dots, S_k$（子集元素取自 $1, 2, \dots, N$）满足以下条件：

1. 每个整数 $1, 2, \dots, N$ 恰好包含在其中两个集合中。
2. 任意两个集合 $S_i, S_j$ 恰好有一个公共元素。

如果存在，请构造这样的一组集合。

### 输入格式

输入包含一个整数 $N$。

- $1 \leqslant N \leqslant 10^5$

### 题解
:spoiler[阅读理解题,能读懂题目就是纯送]

假设设有 $k$ 个集合。

根据题意，每两个不同的集合中必须有恰好一个相同的数，且每个数恰好包含在两个集合中。但是显然，如果有两个集合恰好有一个相同的数，那这个数就是出现了两次！

因此得到推论：$1 \sim N$ 必须与集合间的所有交集形成一一对应的关系。即问题有解当且仅当$n = \frac{k(k-1)}{2}$

那通过一元二次方程的求根公式来计算 $k^2 - k - 2N = 0$ 的非负整数解即可，得到：
$$k = \frac{1 + \sqrt{1 + 8N}}{2}$$
如果解的 $k$ 不是整数，则输出 No；否则输出 Yes 并进行构造。

构造方案：
既然我们都知道集合的个数 $k$ 了，我们直接遍历这 $k$ 个集合间两两的交集，然后往这两个集合里放一个独一无二的数 $x$（$x$ 从 $1$ 递增到 $N$）即可。使用 `set` 或 `vector` 来维护每个集合的元素。

```cpp
#include<bits/stdc++.h> 
using namespace std; 
#define int long long 
#define endl '\n' 
#define rep(i, f, l) for(int i(f); i <= l; ++i) 
#define per(i, f, l) for(int i(f); i >= l; --i) 
const int N = 1e5 + 5; 
set<int> s[N]; 
void work() { 
	 int n; 
	 cin >> n; 
	 int k = (1 + sqrt(1 + 8 * n)) / 2; 
	 if(k * k - k != 2 * n){ 
	 	 cout << "No" << endl; 
	 	 return; 
	 } 
	 cout << "Yes" << endl; 
	 cout << k << endl; 
	 int x = 1; 
	 rep(i, 1, k){ 
	 	 rep(j, i + 1, k){ 
	 	 	 s[i].insert(x); 
	 	 	 s[j].insert(x); 
	 	 	 ++x; 
	 	 } 
	 } 
	 rep(i, 1, k){ 
	 	 cout << s[i].size() << ' '; 
	 	 for(auto v : s[i]){ 
	 	 	 cout << v << ' '; 
	 	 } 
	 	 cout << endl; 
	 } 
	 return; 
} 
signed main() { 
	 ios::sync_with_stdio(0); 
	 cin.tie(0); 
	 cout.tie(0); 
	 int t = 1; 
// 	 cin >> t; 
	 while (t--) { 
	 	 work(); 
	 } 
	 return 0; 
}
```
