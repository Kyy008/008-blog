---
title: 2026第七&八次蓝桥赛制个人赛题解
published: 2026-02-12
description: 打ACM就是图一乐，早该找个电子厂上班了
image: ./cover.webp
tags:
  - 算法竞赛
category: 算法竞赛
draft: false
---
# 8-F.  fLIP  (通过人数 19/48)

### 题目描述

给定一个 $N \times M$ 的网格，初始全为白色。
每次操作可以选择一行或一列，将该行或该列的所有方格颜色反转（白变黑，黑变白）。
问是否可能通过任意次操作，使得网格中恰好有 $K$ 个黑色方格。如果可以，输出 `Yes`，否则输出 `No`。

### 输入格式

$N \ M \ K$

- $1 \le N, M \le 1000$
- $0 \le K \le N \times M$

### 题解

首先需要想到，操作结果仅于行操作和列操作的操作次数有关而与顺序无关。举个例子，假设我们某次方案摁下了第2，5，6行的按钮，那把它换成摁下1，3，4行的按钮结果也完全一样；列的操作也是同理。因此我们根本不需要复杂的数学推导，只需要暴力枚举行操作和列操作的次数就可以了。

计算变成黑色的方格数也很简单，减去行和列的交叉覆盖的方格数量就可以了。

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
#define endl '\n'
#define rep(i, f, l) for(int i(f); i <= l; ++i)
#define per(i, f, l) for(int i(f); i >= l; --i)
const int N = 2e5 + 5;
void work() {
	int n, m, k;
	cin >> n >> m >> k;
	rep(i, 0, n) {
		rep(j, 0, m) {
			if((i * m + j * n - 2 * i * j) == k) {
				cout << "Yes" << endl;
				return;
			}
		}
	}
	cout << "No" << endl;
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

# 7-D.  Two Alpinists  (通过人数 16/43)

### 题目描述

有 $N$ 座山排成一行，高度为 $h_i$。
Takahashi 从西向东走，Aoki 从东向西走。
对于每座山 $i$，Takahashi 记录了到达该山时的历史最高高度 $T_i$，Aoki 记录了到达该山时的历史最高高度 $A_i$。
已知记录序列 $T$ 和 $A$，求可能的山峰高度序列的数量，对 $10^9 + 7$ 取模。

### 输入格式

$N$
$T_1 \ T_2 \ \dots \ T_N$
$A_1 \ A_2 \ \dots \ A_N$

- $1 \le N \le 10^5$
- $1 \le T_i, A_i \le 10^9$
- $T_i \le T_{i+1}$
- $A_i \ge A_{i+1}$

### 题解

乍一看是一个动态规划，实际手模一遍样例就能发现是简单的乘法原理题。

不难发现：
- 如果 $T_i > T_{i-1}$，说明第 $i$ 座山的高度必须**恰好**是 $T_i$
- 如果 $A_i > A_{i+1}$，说明第 $i$ 座山的高度必须**恰好**是 $A_i$

遍历每座山进行分类讨论：
1. **同时满足必须等于 $T_i$ 且必须等于 $A_i$**：若 $T_i \ne A_i$，则无解
2. **仅有必须等于 $T_i$**：此时需要满足 $T_i \le A_i$（因为 $h_i \le A_i$），否则无解
3. **仅有必须等于 $A_i$**：此时需要满足 $A_i \le T_i$（因为 $h_i \le T_i$），否则无解
4. **没有强制等于的限制**：此时 $h_i$ 可以是 $[1, \min(T_i, A_i)]$ 范围内的任意整数。方案数为 $\min(T_i, A_i)$

最终答案为所有山峰可能方案数的乘积。时间复杂度 $O(N)$。

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
#define endl '\n'
#define rep(i, f, l) for(int i(f); i <= l; ++i)
#define per(i, f, l) for(int i(f); i >= l; --i)
const int N = 2e5 + 5;
int a[N];
int b[N];
const int mod = 1e9 + 7;
void work() {
	int n;
	cin >> n;
	rep(i, 1, n) cin >> a[i];
	rep(i, 1, n) cin >> b[i];
	int ans = 1;
	rep(i, 1, n){
		bool f1 = (a[i] > a[i - 1]);
		bool f2 = (b[i] > b[i + 1]);
		if(f1 && f2){
			if(a[i] != b[i]) {
				cout << 0 << endl;
				return;
			}
		} else if(f1){
			if(a[i] > b[i]){
				cout << 0 << endl;
				return;
			}
		} else if(f2){
			if(a[i] < b[i]){
				cout << 0 << endl;
				return;
			}
		} else{
			ans = ans * (min(a[i], b[i])) % mod;
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
//	cin >> t;
	while (t--) {
		work();
	}
	return 0;
}
```

# 8-D.  Time Gap  (通过人数 7/48)

### 题目描述

有 $N+1$ 个人（包括 Takahashi），他们所在的城市之间存在时差。
两个城市之间的时差定义为：若 A 城市 0 点时 B 城市为 $d$ 点，则时差为 $\min(d, 24-d)$。
现在第 $i$ 个人与 Takahashi 的时差为 $D_i$，Takahashi 现在在0点，你需要为其他 $N$ 个人分配具体的时间（$d$ 或 $24-d$），使得任意两人之间时差的最小值 $s$ 最大化。求 $s$ 的最大值。

### 输入格式

$N$
$D_1 \ D_2 \ \dots \ D_N$

- $1 \le N \le 50$
- $0 \le D_i \le 12$

### 题解

首先我们容易发现：
- 如果某个 $D_i$ 出现的次数 $\geq 3$，那么根据鸽巢原理，必然有两个人的时间相同，此时最小时间差一定为 0。
- 特殊地，时差为 $0$ 和时差为 $12$ 的点仅有一个，所以如果出现次数超过 1 次，最小时间差也为 0。

排除上面情况后，一定存在一种方案使得最小时间差大于 0，此时我们考虑：
- 如果一个时差 $D_i$ 出现了 2 次，那么为了使间隔不为 0，必须一个取 $D_i$，另一个取 $24-D_i$。因此这两个位置已经可以确定了。
- 如果 $D_i$ 只出现 1 次且不是 0 或 12，那么它可以取 $D_i$ 或 $24-D_i$。由于我们无法判断哪个更优，直接暴力出奇迹就好了，枚举所有有可能的时间点（其实就两个）后计算最小值就好了。由于最多只有 12 个时差给我们暴力选择，因此不可能超时

代码实现时，我们用`v1`记录已经确定的时间点，用`v2`记录需要暴力选择的时差，dfs 以`v1`为起始状态，每次 `push_back`一个`v2`的状态即可。当 dfs 深度为`v2`的长度时，表明所有不确定的时间点都已经枚举完了，直接计算最小时差即可。


 DFS 的复杂度为 $O(2^{12})$，计算最小间隔需要排序复杂度 $O(N \log N)$。总复杂度约为 $O(2^{12} \cdot N \log N)$

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
#define endl '\n'
#define rep(i, f, l) for(int i(f); i <= l; ++i)
#define per(i, f, l) for(int i(f); i >= l; --i)
const int N = 66;
int a[N];
int n;
int tong[N];
int ans = 0;
vector<int> v1;
vector<int> v2;
void dfs(int x, vector<int> v) {
	if(x == v2.size()){
		sort(v.begin(), v.end());
		int mi = 24 - v[v.size() - 1];
		for(int i = 1; i < v.size(); ++i){
			mi = min(mi, v[i] - v[i - 1]);
		}
		ans = max(ans, mi);
		return;
	}
	
	v.push_back(v2[x]);
	dfs(x + 1, v);
	v.pop_back();

	v.push_back(24 - v2[x]);
	dfs(x + 1, v);
	v.pop_back();
}

void work() {
	cin >> n;
	rep(i, 1, n) {
		cin >> a[i];
		tong[a[i]]++;
	}
	tong[0]++;
	rep(i, 0, 12){
		if(tong[i] >= 3) {
			cout << 0 << endl;
			return;
		}
	}
	if(tong[0] >= 2 || tong[12] >= 2) {
		cout << 0 << endl;
		return;
	}
	rep(i, 0, 12){
		if(tong[i] == 2){
			v1.push_back(i);
			v1.push_back(24 - i);
		}
		if(tong[i] == 1){
			if(i == 12 || i == 0){
				v1.push_back(i);
			} else{
				v2.push_back(i);
			}
		}
	}
	
	dfs(0, v1);
	cout << ans << endl;
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