---
title: 2026第五&六次蓝桥赛制个人赛题解
published: 2026-02-11
description: 不好说
image: ./cover.webp
tags:
  - 算法竞赛
category: 算法竞赛
draft: false
---
想了想后发现，由于水题不想写，难题不会做，每场比赛大概只有 2 题值得我去写题解，还是每两次比赛发一次题解比较好
# 5-D.  Subarray Sum (通过人数 5/56)

### 题目描述

构造一个长度为 $N$ 的整数序列 $A$，满足 $1 \le A_i \le 10^9$，且恰好有 $K$ 个子段的和等于 $S$。

### 输入格式

输入通过标准输入给出，格式如下：

$N \ K \ S$

- $1 \le N \le 10^5$
- $0 \le K \le N$
- $1 \le S \le 10^9$
- 输入的所有值均为整数。

### 题解

由于评测姬坏掉导致 SPJ 的判定问题导致通过人数少的可怜，实际上这个题目非常简单。

简单构造题。想让构造方法尽可能简单，我们直接让符合条件的子段和为这个数 $S$ 本身就好了，想要 $K$ 个 $S$ 我们就先直接输出 $K$ 个 $S$ 。

由于一共要输出 $N$ 个数，那我们只需要保证输出的数列不可能凑出一个子段和为 $S$ 即可，自然想到填充比 $S$ 大的数，比如 $S+1$ 即可。此处需要特判一下，由于要求输出的数 $A_i \le 10^9$ ，如果 $S$ 恰好为 $10^9$ ，我们不妨输出 $1$ ,毕竟不可能有 $10^9$ 个 $1$ 让你凑出 $S$ 
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
#define endl '\n'
void work() {
    int n, k, s;
    cin >> n >> k >> s;
    for (int i = 0; i < n; ++i) {
        if (i < k) {
            cout << s;
        } else {
            if (s == 1000000000) {
                cout << 1;
            } else {
                cout << s + 1;
            }
        }
        if (i != n - 1) cout << ' ';
    }
    cout << endl;
}

signed main() {
    ios::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);
    int t = 1;
    // cin >> t;
    while (t--) {
        work();
    }
    return 0;
}
```
# 6-D.  Favorite Number (通过人数 24/50)

### 题目描述

给定正整数 $N$，求所有满足 $\lfloor \frac{N}{m} \rfloor = (N \mod m)$ 的正整数 $m$ 的和。

### 输入格式

一个数 $N$ 满足 $1 \le N \le 10^{12}$

### 题解
:spoiler[~~一眼根号时间复杂度~~]
由于 $N \le 10^{12}$，直接枚举 $m$ 肯定超时，我们需要寻找更优的做法。

光看条件会有点不知从何下手，不妨列方程看看。设 $\lfloor \frac{N}{m} \rfloor = (N \mod m) = x$，则有 $N = m \cdot x + x = x(m+1)$，移项可得 $m = \frac{N}{x} - 1$。

由于 $m$ 是正整数，且 $x$ 是余数，必须满足 $0 \le x < m$。
代入 $m$ 的表达式：$x < \frac{N}{x} - 1 \implies x(x+1) < N$。

因此，我们只需要枚举满足 $x(x+1) < N$ 的正整数 $x$。如果 $x$ 能整除 $N$，则对应的 $m = \frac{N}{x} - 1$ 就是一个合法的解。

时间复杂度为 $O(\sqrt{N})$。

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
#define endl '\n'
#define rep(i, f, l) for(int i(f); i <= l; ++i)
#define per(i, f, l) for(int i(f); i >= l; --i)
const int N = 2e5 + 5;
void work() {
	int n;
    cin >> n;
    int ans = 0;
    for(int x = 1; x * (x + 1) < n; x++){
        if(n % x) continue;
        ans += (n / x) - 1;
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
# 6-D.  Concatenation (通过人数 19/50)

### 题目描述

给定 $N$ 个字符串 $s_1, s_2, \dots, s_N$。
将这些字符串任意排序后拼接成一个长字符串，求拼接后的字符串中 "AB" 出现次数的最大值。

### 输入格式

$N$
$s_1$
...
$s_N$

- $1 \le N \le 10^4$
- $2 \le |s_i| \le 10$
- $s_i$ 仅由大写英文字母组成。
### 题解

首先统计每个字符串内部的 "AB" 数量。

然后考虑拼接处的 "AB"，这取决于前一个串的末尾是否为 'A' 且后一个串的开头是否为 'B'。
我们将字符串按首尾字符分类：
- `x`类：`B...` (首 B 尾非 A)，个数为 $x$
- `y`类：`...A` (首非 B 尾 A)，个数为 $y$
- `z`类：`B...A` (首 B 尾 A)， 个数为 $z$

贪心策略：
1. `z` 类字符串可以全部串联，贡献 $z-1$ 个 "AB"，并形成一个巨大的 `B...A` 串。
2. 若同时存在 `x` 和 `y` 类，可将 `z` 串联后的整体夹在中间：`(...A) + [B...A] + (B...)`，额外贡献 2 个 "AB"。
3. 剩余的 `x` 和 `y` 两两配对。

根据 $x, y, z$ 是否存在分类讨论输出即可。

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
#define endl '\n'
#define rep(i, f, l) for(int i(f); i <= l; ++i)
#define per(i, f, l) for(int i(f); i >= l; --i)
const int N = 1e4 + 5;
string s[N];
void work() {
	int n;
    cin >> n;
    int ans = 0;
    rep(i, 1, n) cin >> s[i];
    int x = 0, y = 0, z = 0;
    rep(i, 1, n){
        for(int j = 0; j < s[i].size() - 1; j++){
            if(s[i][j] == 'A' && s[i][j + 1] == 'B'){
                ans++;
                j++;
            }
        }
        if(s[i][0] == 'B' && s[i][s[i].size() - 1] == 'A'){
            z++;
        } else if(s[i][0] == 'B'){
            x++;
        } else if(s[i][s[i].size() - 1] == 'A'){
            y++;
        }
    }
    if(x && y && z){
        cout << ans + z + 1 + min(x - 1, y - 1) << endl;
    } else if(x && y){
        cout << ans + min(x, y) << endl;
    } else if((x && z) || (y && z)){
        cout << ans + z << endl;
    } else if(x == 0 && y == 0 && z > 0){
        cout << ans + z - 1 << endl;
    } else {
        cout << ans << endl;
    }
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

# 5-A.  Swap and Flip (通过人数 8/56)

### 题目描述

有 $N$ 张卡片，编号为 $1, 2, \dots, N$。
第 $i$ 张卡片 ($1 \le i \le N$) 正面写有整数 $A_i$，背面写有整数 $B_i$。
初始时，卡片按 $1$ 到 $N$ 的顺序从左到右排列，正面朝上。
判断是否可以通过以下操作使朝上的数字从左到右构成非降序列。如果可以，求最小操作次数。
- 选择整数 $i$ ($1 \le i \le N-1$)。交换第 $i$ 张和第 $i+1$ 张卡片，并翻转这两张卡片。

### 输入格式

$N$
$A_1 \ A_2 \ \dots \ A_N$
$B_1 \ B_2 \ \dots \ B_N$
- $1 \le N \le 18$
- $1 \le A_i, B_i \le 50$

### 题解

:spoiler[~~看到数据范围，是不是应该 0秒猜出算法~~]

卡牌个数 $N \le 18$，表明我们可以二进制暴力枚举每个卡牌是否被翻转；而只要每张卡牌确定是否被翻转，排序后的卡牌顺序也可以唯一确定了。注意这里和之后的 “被翻转” 是指最终状态而不考虑过程。

想到这，我们不妨思考一下：每种二进制状态都一定是合法的吗？我们模拟几组数据就可以不难发现：
- 被翻转的卡牌个数一定是偶数个。
- 假设一张卡牌现在位于 $x$，被排序后位于 $y$，那么若 $|x-y| \equiv 0 \pmod 2$，这张卡牌一定没有被翻转；若 $|x-y| \equiv 1 \pmod 2$，则一定被翻转。因为卡牌每移动一格就要翻一次，所以也很好理解。

那我们先检验上述约束的合法性。对于第一个，假设我们二进制枚举时用 $1$ 表示卡牌被翻转了，只需要统计状态 $1$ 的个数就好了。如果 $1$ 的个数是奇数直接不考虑这个状态。

对于第二个约束，既然确定了每个卡片的状态，每个卡的值也是确定的。我们把这些卡牌的值排序后保存在一个 `targ` 数组中，表示我们的目标状态。接着我们暴力循环一一比对`targ` 的每张卡和原数组的每张卡，再根据约束检验合法性就好了。如果不合法，我们就跳过当前这个比对循环。

如果这些约束都满足，那我们如何计算操作次数呢？由于我们只能交换相邻元素，将一个序列变为有序序列的最小交换次数等于该序列的**逆序对数**。具体地，若排序后的第 $i$ 个位置存放的是原序列中第 $p_i$ 个位置的卡片，那么 $p_0, p_1, \dots, p_{N-1}$ 这个排列的逆序对数就是当前状态下的最小操作次数。

二进制枚举时间复杂度 $O(2^N)$，比对序列以及计算逆序对时间复杂度都是 $O(N^2)$，因此总的时间复杂度为 $O(N^2 \cdot 2^N)$。


```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
#define endl '\n'
#define rep(i, f, l) for(int i(f); i <= l; ++i)
#define per(i, f, l) for(int i(f); i >= l; --i)
const int N = 30;
int a[N];
int b[N];
int pos[N];
int vis[N];
int ans = INT_MAX;
struct node{
	int x;
	int state;
};
node nums[N];
void work() {
	int n;
	cin >> n;
	rep(i, 0, n - 1) cin >> a[i];
	rep(i, 0, n - 1) cin >> b[i];
	for(int s = 0; s <= (1 << n) - 1; s++){
		if (__builtin_popcount(s) % 2 != 0) continue;
		vector<int> targ;
		for(int i = 0; i < n; i++){
			
			if(s & (1 << i)){
				nums[i].x = b[i];
				nums[i].state = 1;
			} else{
				nums[i].x = a[i];
				nums[i].state = 0;
			}
			targ.push_back(nums[i].x);
		}
		sort(targ.begin(), targ.end());
		bool fail = 0;
		for(int i = 0; i < n; i++) vis[i] = 0;
		for(int i = 0; i < n; i++){
			bool f = 0;
			for(int j = 0; j < n; j++){
				if(vis[j]) continue;
				if(nums[i].x != targ[j]) continue;
				if(abs(i - j) % 2 != nums[i].state) continue;
				if(nums[i].x < targ[j]) break;
				vis[j] = 1;      
                pos[i] = j;        
                f = 1;
                break;
			}
			if(!f){
				fail = 1;
				break;
			}
		}
		if(!fail){
			int cnt = 0;
            for(int i = 0; i < n; i++) {
                for(int j = i + 1; j < n; j++) {
                    if(pos[i] > pos[j]) cnt++;
                }
            }
            ans = min(ans, cnt);
		}
	}
	if(ans == INT_MAX) cout << -1 << endl;
	else cout << ans << endl;
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
