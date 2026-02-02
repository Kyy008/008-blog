---
title: 2026第四次蓝桥赛制个人赛题解
published: 2026-02-02
description: 第三次的死掉了～
image: ./cover.webp
tags:
  - 算法竞赛
category: 算法竞赛
draft: false
---
本场五六水依旧迷之难度:spoiler[~~往蓝桥杯省赛训练塞紫题和黑题，你无敌了~~]
# C. Exam and Wizard(通过人数 28/42)

### 题目描述

高桥君要参加 $N$ 门考试。第 $i$ 门考试当前的准备度为 $A_i$，通过所需的最小准备度为 $B_i$。
魔法师青木可以重新分配准备度，但总准备度 $\sum A_i$ 保持不变。
求最少修改多少门考试的准备度（即 $A_i \neq C_i$ 的数量），使得所有考试都能通过（$C_i \ge B_i$）。
如果无法达成，输出 -1。

### 输入格式

输入第一行包含一个整数 $N$。
第二行包含 $N$ 个整数 $A_1, \dots, A_N$。
第三行包含 $N$ 个整数 $B_1, \dots, B_N$。

- $1 \le N \le 10^5$
- $1 \le A_i, B_i \le 10^9$

### 题解

思路：考虑贪心，优先让多出来最多的考试匀给不够的考试。因此分配方案是，按准备度之差从低到高排序后，从后往前分配，直到所有考试准备度之差非负。

不过首先判断总准备度是否足够。如果 $\sum A_i < \sum B_i$，则无论如何分配都无法通过所有考试，输出 -1。

排序操作贡献时间复杂度 $ O((N \log(N)) $

```cpp
#include<bits/stdc++.h> 
using namespace std; 
#define int long long 
#define endl '\n' 
#define rep(i, f, l) for(int i(f); i <= l; ++i) 
#define per(i, f, l) for(int i(f); i >= l; --i) 
const int N = 2e5 + 5; 
struct node{ 
    int x; 
    int y; 
    int dif; 
}; 
node a[N]; 
bool cmp(node a, node b){ 
    return a.dif < b.dif; 
} 
void work() { 
	 int n; 
     cin >> n; 
     int sum = 0; 
     rep(i, 1, n){ 
         cin >> a[i].x; 
     } 
     rep(i, 1, n){ 
         cin >> a[i].y; 
         a[i].dif = a[i].x - a[i].y; 
         sum += a[i].dif; 
     } 
     if (sum < 0) { 
         cout << -1 << endl; 
         return; 
     } 
     sort(a + 1, a + n + 1, cmp); 
     int ans = 0; 
     int need = 0; 
     rep(i, 1, n){ 
         if(a[i].dif >= 0) break; 
         need += a[i].dif; 
         ans++; 
     } 
     if(need == 0){ 
         cout << 0 << endl; 
         return; 
     } 
     per(i, n, 1){ 
         if(need >= 0) break; 
         need += a[i].dif; 
         ans++; 
         
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
# E. KEYENCE String(通过人数 21/42)

### 题目描述

如果一个字符串可以通过移除一次连续子串（可以是空串）变成 "keyence"，则称该字符串为 "KEYENCE string"。
给定一个由小写英文字母组成的字符串 $S$，判断它是否为 "KEYENCE string"。

### 输入格式

输入包含一个字符串 $S$。

- $7 \leqslant |S| \leqslant 100$
- $S$ 由小写英文字母组成

### 题解

定睛一看$|S| \leqslant 100$，比赛时由于着急过题直接抛弃大脑，暴力出奇迹（
思路：由于是从一个字符串中间扣出一段，再拼接剩余两段，直接暴力枚举扣出字符串的首尾字符，然后再暴力拼接即可。时间复杂度$O(|S|^3)$

```cpp
#include<bits/stdc++.h> 
using namespace std; 
#define int long long 
#define endl '\n' 
#define rep(i, f, l) for(int i(f); i <= l; ++i) 
#define per(i, f, l) for(int i(f); i >= l; --i) 
const int N = 2e5 + 5; 
void work() { 
	 string s; 
     cin >> s; 
     string ans = ""; 
     if (s == "keyence") { 
         cout << "YES" << endl; 
         return; 
     } 
     for(int i = 0; i < s.size(); i++){ 
         for(int j = i; j < s.size(); j++){ 
             for(int k = 0; k < s.size(); k++){ 
                 if(k >= i && k <= j) continue; 
                 ans += s[k]; 
             } 
             if(ans == "keyence"){ 
                 cout << "YES" << endl; 
                 return; 
             } else{ 
                 ans = ""; 
             }   
         } 
     } 
 	 cout << "NO" << endl; 
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
~~不过这个思路有点太蠢了~~，有没有一种更高效的办法呢？当然有的，而且直接降维打击到$O(1)$。

仔细思考一下就能发现，如果答案是 “YES“，那么这个字符串的前缀必然是 "keyence" 的某个前缀，这个字符串的后缀必然是 "keyence" 对应的那个后缀。因此实际上，我们只需要遍历 "keyence"所有的前后缀拆分情况，再和原串的前后缀作比对就行了～。

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
#define endl '\n'
#define rep(i, f, l) for(int i(f); i <= l; ++i)
#define per(i, f, l) for(int i(f); i >= l; --i)
const int N = 2e5 + 5;
void work() {
	string s;
    cin >> s;
    string targ = "keyence";
    if (s.size() < 7) {
        cout << "NO" << endl;
        return;
    }
    rep(i, 0, 7){
        string s1 = targ.substr(0, i);
        string s2 = targ.substr(i, targ.size() - i);
        if((s1 == s.substr(0, s1.size())) && (s2 == s.substr(s.size() - s2.size(), s2.size()))){
            cout << "YES" << endl;
            return;
        }
    }
    cout << "NO" << endl;
    return;
}
signed main() {
	ios::sync_with_stdio(0);
	cin.tie(0);
	cout.tie(0);
	int t = 1;
//	cin >> t;
	while (t--) {
		work();
	}
	return 0;
}
```

# D.  Double Landscape(通过人数 8/42)

### 题目描述

在一个 $N \times M$ 的网格中填入 $1$ 到 $N \times M$ 的所有整数，不重复。
要求满足以下条件：
- 第 $i$ 行的最大值是 $A_i$。
- 第 $j$ 列的最大值是 $B_j$。

求填入方案数，对 $10^9 + 7$ 取模。

### 输入格式

第一行包含两个整数 $N, M$。
第二行包含 $N$ 个整数 $A_1, \dots, A_N$。
第三行包含 $M$ 个整数 $B_1, \dots, B_M$。

- $1 \le N, M \le 1000$
- $1 \le A_i, B_j \le N \times M$

### 题解

超绝思维妙妙题。实际上没有看起来的那么难。

首先我们需要打破思维定势：如果从小到大去填数，会发现由于限制条件是最大值，小的数几乎可以填到任何地方，完全没有考虑后续大数的限制；我们不妨反过来思考，如果从**大到小填数**，当我们把一个大数填到某行/列并满足其最大值限制后，剩下的小数就可以真正意义上的在这行/列无限制的排列了。

那么对于一个要填的数 $x$，我们关心的是有多少行/列是之前已经满足最大值条件，可以自由排列的。因此我们维护两个变量，用 `cnt1` 记录目前可用的行数（该行的最大值已经被填入），`cnt2`记录目前可用的列数。

那我们分析后可以得出，对于当前数字 $x$：
1. 如果 $x$ 既是某行最大值 $A_i$，又是某列最大值 $B_j$：
   - 那么这个数字必须填在 $(i, j)$ 这个格子上。
   - 此时`cnt1 += 1`,`cnt2 += 1`。
   
2. 如果 $x$ 只是某行最大值 $A_i$：
   - 它必须填在第 $i$ 行，且必须填在一个 “可用列” 中
   - 方案数为 $cnt2$
   - `cnt1 += 1`

3. 如果 $x$ 只是某列最大值 $B_j$：
   - 它必须填在第 $j$ 列，且必须填在一个“可用行”中。
   - 方案数为 $cnt1$。
   - `cnt2 += 1`

4. 如果 $x$ 既不是行最大值也不是列最大值：
   - 它必须填在一个 “可用行” 且 “可用列” 的交叉位置上。
   - 这样的位置总共有 $cnt1 \times cnt2$ 个，但是其中有一些已经填过比 $x$ 大的数了。
   - 已经填过的格子总数是 $(N \times M - x)$, 所以可选位置数为 $cnt1 \times cnt2 - (N \times M - x)$。

最终答案为每一步方案数的乘积。代码实现很简单，重要的是上述思维的过程。

另外注意当进行 “检查当前数 `x` 是否在限制条件中” 的操作时，我们直接暴力查找会导致超时。可以直接空间换时间，建立一个 bool 桶数组记录这些数是否存在。

时间复杂度$O(NM)$
```cpp
#include<bits/stdc++.h> 
using namespace std; 
#define int long long 
#define endl '\n' 
#define rep(i, f, l) for(int i(f); i <= l; ++i) 
#define per(i, f, l) for(int i(f); i >= l; --i) 
const int N = 1e3 + 5; 
int a[N]; 
int b[N]; 
bool in_a[N * N]; 
bool in_b[N * N]; 
const int mod = 1e9 + 7; 
bool is_in(int arr[], int len, int x) { 
	 rep(i, 1, len) { 
	 	 if (arr[i] == x) return true; 
	 } 
	 return false; 
} 
void work() { 
	 int n, m; 
	 cin >> n >> m; 
	 rep(i, 1, n) cin >> a[i], in_a[a[i]] = true; 
	 rep(i, 1, m) cin >> b[i], in_b[b[i]] = true; 
	 int cnt1 = 0, cnt2 = 0; 
	 int ans = 1; 
	 per(x, n * m, 1){ 
	 	 if(in_a[x] && in_b[x]){ 
	 	 	 cnt1++; 
	 	 	 cnt2++; 
	 	 	 continue; 
	 	 } 
	 	 if(in_a[x]){ 
	 	 	 cnt1++; 
	 	 	 ans = (ans % mod * cnt2 % mod) % mod; 
	 	 	 continue; 
	 	 } 
	 	 if(in_b[x]){ 
	 	 	 cnt2++; 
	 	 	 ans = (ans % mod * cnt1 % mod) % mod; 
	 	 	 continue; 
	 	 } 
	 	 ans = (ans * (cnt1 * cnt2 - (n * m - x)) % mod) % mod; 
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
