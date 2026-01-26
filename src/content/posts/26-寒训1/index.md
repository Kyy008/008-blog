---
title: 2026第一次蓝桥赛制个人赛题解
published: 2026-01-26
description: 尝试着写着玩一下吧～
image: ./cover.webp
tags: [算法竞赛]
category: 算法竞赛
draft: false
---

- [B. Sign of Friendship](#b-sign-of-friendship通过人数-5469)
- [D. UFO Invasion](#d-ufo-invasion通过人数-4869)
- [C. Message from Aliens](#c-message-from-aliens通过人数-2169)
- [A. MAD TEAM](#a-mad-team通过人数-1369)
- [F. Fly to the UFO](#f-fly-to-the-ufo通过人数-1069)

距离 Kyy008 参加蓝桥杯省赛还有3个月，但是经过第一次训练赛的拷打后发现什么都不会，遂记录总结。qwq

# B. Sign of Friendship(通过人数 54/69)

### 题目描述

你现在站在一座高塔的底部（高度为 0）。在距离塔 $D$ 的位置，空中有个高度为 $H$ 的 UFO。

塔和 UFO 之间有 $N$ 个障碍物。第 $i$ 个障碍物位于距离塔 $d_i$ 的位置，高度为 $h_i$。

你需要爬到塔上的某个高度，使得你与 UFO 之间的连线不穿过任何障碍物。求你需要爬升的最小高度。

> 假设地面是平坦的，塔和障碍物垂直于地面。如果障碍物的顶点恰好在连线上，视为不阻挡。

### 输入格式

第一行包含三个整数 $N, D, H$。
接下来 $N$ 行，每行包含两个整数 $d_i, h_i$。

- $1 \leqslant N \leqslant 100$
- $1 \leqslant d_i < D \leqslant 1000$
- $1 \leqslant h_i < H \leqslant 1000$

### 题解

简答几何。思考对于每一个障碍物，如果视线要越过它，我们在塔上至少需要多高？
假设视线刚好经过第 $i$ 个障碍物的顶点 $(d_i, h_i)$ 射向 UFO $(D, H)$。计算两点连成的一次函数。

1.  **斜率**：
    $$
    k = \frac{H - h_i}{D - d_i}
    $$

2.  **截距**：

    根据直线方程 $y - y_0 = k(x - x_0)$，令 $x=0$，即塔的位置：
    $$
    y - H = k(0 - D) \implies y = H - k \times D
    $$
    代入 $k$ 可得该障碍物要求的最小高度 $b_i$：
    $$
    b_i = H - \frac{H - h_i}{D - d_i} \times D
    $$

为了避开所有障碍物，我们需要的高度必须大于等于所有 $b_i$。因此，最终答案是所有 $b_i$ 中的最大值。同时，高度不能为负数，初始化答案为 0 即可。

```cpp
#include<bits/stdc++.h> 
using namespace std; 

#define int long long 
#define endl '\n' 
#define rep(i, f, l) for(int i(f); i <= l; ++i) 
#define per(i, f, l) for(int i(f); i >= l; --i) 

const int N = 2e5 + 5; 

void work() { 
    double n, d, h; 
    cin >> n >> d >> h; 
    double ans = 0; 
    while(n--){ 
        double x, y; 
        cin >> x >> y; 
        double b = h - (h - y) / (d - x) * d; 
        ans = max(ans, b); 
    } 
    cout << fixed << setprecision(12) << ans << endl; 
    return; 
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

# D. UFO Invasion(通过人数 48/69)

### 题目描述

给定一个长度为 12 的字符串 $S$，判断其中包含多少个子串 "ZONe"。

### 输入格式

输入包含一个长度为 12 的字符串 $S$。

### 题解

字符串模拟。遍历字符串，使用 `substr` 方法检查所有长度为 4 的子串是否等于 "ZONe" 即可。

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
    int ans = 0; 
    rep(i, 0, (int)s.size() - 4) { 
        if (s.substr(i, 4) == "ZONe") { 
            ans++; 
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

# C. Message from Aliens(通过人数 21/69)

### 题目描述

给定一个加密字符串 $S$，解密规则如下：

1.  初始时，$T$ 为空字符串。
2.  从左到右遍历 $S$ 的每个字符：
    *   如果是 'R'，反转 $T$。
    *   如果不是 'R'，将该字符追加到 $T$ 的末尾。
3.  操作完成后，如果 $T$ 中存在两个连续相同的字符，将它们删除。重复此操作直到无法删除为止。

### 输入格式

输入包含一个字符串 $S$，由小写英文字母和 'R' 组成。

- $1 \leqslant |S| \leqslant 5 \times 10^5$

### 题解

首先考虑暴力解法。模拟解密规则，遇到 'R' 时直接进行反转操作。经分析，最坏情况下时间复杂度会达到 $O(|S|^2)$

我们发现上述解法在反转字符串操作上浪费了大量时间，而反转一次字符串后在串尾追加字符与直接在串头追加字符的操作等价，因此反转整个字符串的操作事实上是冗余的。
考虑使用双端队列 `deque` 来维护字符串 $T$，并用一个布尔变量 `f` 记录当前的翻转状态：

-   当遇到 'R' 时，切换翻转状态 `f ^= 1`。
-   当遇到普通字符时：
    -   如果 `f == 0`，字符应加在队尾。
    -   如果 `f == 1`，字符应加在队首。

同时，题目要求删除连续相同的字符。利用栈的思想，在加入新字符前，先检查加入端的字符是否与新字符相同：
-   如果相同，则弹出原有字符。
-   如果不相同，则将新字符推入。

最后，根据最终的翻转状态 `f`，决定是从头到尾还是从尾到头输出队列中的字符。即经过奇数次反转后倒序输出，偶数次反转后顺序输出。算法时间复杂度 $O(|S|)$

```cpp
#include<bits/stdc++.h> 
using namespace std; 
#define int long long 
#define endl '\n' 
#define rep(i, f, l) for(int i(f); i <= l; ++i) 
#define per(i, f, l) for(int i(f); i >= l; --i) 
const int N = 2e5 + 5; 
deque<char> q; 
void work() { 
    string s; 
    cin >> s; 
    bool f = 0; 
    rep(i, 0, (int)s.size() - 1) { 
        if(s[i] == 'R'){ 
            f ^= 1; 
            continue; 
        } 
        if(!f){ 
            if(!q.empty() && q.back() == s[i]) { 
                q.pop_back(); 
            } else { 
                q.push_back(s[i]); 
            } 
        } else { 
            if(!q.empty() && q.front() == s[i]) { 
                q.pop_front(); 
            } else { 
                q.push_front(s[i]); 
            } 
        } 
    } 
    string ans = ""; 
    for(auto c : q) ans += c; 
    if (f) { 
        reverse(ans.begin(), ans.end()); 
    } 
    cout << ans << endl; 
    return; 
} 

signed main() { 
    ios::sync_with_stdio(0); 
    cin.tie(0); 
    cout.tie(0); 
    int t = 1; 
//  cin >> t; 
    while (t--) { 
        work(); 
    } 
    return 0; 
}
```

# A. MAD TEAM(通过人数 13/69)

### 题目描述

从 $N$ 个候选人中选出 3 人组成一个团队。每个人有 5 个能力值：力量、速度、技巧、知识、创造力。

团队的各项能力值定义为成员中该项能力值的最大值。
团队的综合实力定义为团队 5 项能力值中的最小值。

求团队综合实力的最大可能值。

### 输入格式

第一行包含一个整数 $N$。
接下来 $N$ 行，每行 5 个整数，表示每个人的 5 项能力值。

### 题解

首先考虑暴力解法：直接从 $N$ 个人中枚举 3 个人组成队伍。
从中选出 3 个人的组合数为 $C_N^3 = O(N^3)$。
由于 $N \le 3000$，计算量为 $4.5 \times 10^9$，显然会超时。

但我们可以显然发现答案具有单调性：如果能组成综合实力为 $x$ 的队伍，那么一定能组成综合实力小于 $x$ 的队伍，因此考虑使用**二分答案**。

假设我们要检查是否能组成综合实力至少为 $mid$ 的队伍：
1.  在 `check(mid)` 时，我们只关心某项能力值是否达到 `mid`，而不关心具体数值。因此，对于每个人，可以将他的 5 项能力值转化为一个 5 位的二进制数 `val`。如果某项能力值 $\ge mid$，则对应二进制位为 1，否则为 0。
2. 问题转化为：是否存在 3 个不同或相同的 val，它们的按位或运算结果为 `11111`

由于 val 的取值范围只有 $0 \sim 31$，我们可以记录所有出现过的 val。
枚举这 3 个 val 的所有组合，检查它们的或运算结果是否为 31。综合时间复杂度$ O(\log(10^9) \cdot (N + 32^3)) $


```cpp
#include<bits/stdc++.h> 
using namespace std; 
#define int long long 
#define endl '\n' 
#define rep(i, f, l) for(int i(f); i <= l; ++i) 
#define per(i, f, l) for(int i(f); i >= l; --i) 
const int N = 3005; 
struct person{ 
    int a; 
    int b; 
    int c; 
    int d; 
    int e; 
}; 
person p[N]; 
int n; 
bool check(int x){ 
    vector<int> exist; 
    bool vis[32] = {0}; 
    rep(i, 1, n){ 
        int val = 0; 
        if(p[i].a >= x) val |= (1 << 4); 
        if(p[i].b >= x) val |= (1 << 3); 
        if(p[i].c >= x) val |= (1 << 2); 
        if(p[i].d >= x) val |= (1 << 1); 
        if(p[i].e >= x) val |= (1 << 0); 
        if(!vis[val]){ 
            vis[val] = 1; 
            exist.push_back(val); 
        } 
    } 
    int m = exist.size(); 
    rep(i, 0, m - 1){ 
        rep(j, i, m - 1){ 
            rep(k, j, m - 1){ 
                int comb = exist[i] | exist[j] | exist[k]; 
                if(comb == 31){ 
                    return 1; 
                } 
            } 
        } 
    } 
    return 0; 
} 

void work() { 
    cin >> n; 
    rep(i, 1, n) { 
        cin >> p[i].a >> p[i].b >> p[i].c >> p[i].d >> p[i].e; 
    } 
    int l = 1, r = 1e9; 
    while(r - l >= 5){ 
        int mid = (l + r) >> 1; 
        if(check(mid)){ 
            l = mid; 
        } else { 
            r = mid; 
        } 
    } 
    per(i, r, l){ 
        if(check(i)){ 
            cout << i << endl; 
            return; 
        } 
    } 
    return; 
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

# F. Fly to the UFO(通过人数 10/69)

### 题目描述

在一个二维平面上，你现在位于坐标 $(1, 1)$，想要到达 UFO 的坐标 $(R, C)$。

当你位于 $(r, c)$ 时，可以进行以下四种移动：

1.  从 $(r, c)$ 移动到 $(r, c+1)$，花费 $A_{r,c}$。条件：$c < C$。
2.  从 $(r, c)$ 移动到 $(r, c-1)$，花费 $A_{r,c-1}$。条件：$c > 1$。
3.  从 $(r, c)$ 移动到 $(r+1, c)$，花费 $B_{r,c}$。条件：$r < R$。
4.  选择一个整数 $i$ ($1 \le i < r$)，从 $(r, c)$ 移动到 $(r-i, c)$，花费 $1 + i$。

求从 $(1, 1)$ 移动到 $(R, C)$ 的最小花费。

### 输入格式

第一行包含两个整数 $R, C$。
接下来 $R$ 行，每行 $C-1$ 个整数，表示 $A_{i,j}$。
接下来 $R-1$ 行，每行 $C$ 个整数，表示 $B_{i,j}$。

- $2 \leqslant R, C \leqslant 500$
- $0 \leqslant A_{i,j} < 10^3$
- $0 \leqslant B_{i,j} < 10^3$

### 题解

不难发现这是一个单源最短路问题。我们可以将网格中的每个点视为一个节点，边的权重即为移动的代价。

首先考虑暴力建图：

对于向左、向右、向下都是邻项移动，建边数 $O(R \times C)$ 。
对于向上跳跃，可以从 $(r, c)$ 可以跳到 $(r-1, c), (r-2, c), \dots, (1, c)$，即第 $r$ 行的点需要向建 $r-1$ 个边，建边数$O(C \times R^2)$，使用 $Dijkstra$ 算法会导致超时。

考虑优化向上跳跃的建图方式：

注意到从 $(r, c)$ 跳到 $(r-i, c)$ 的代价是 $1+i$，而假设这个代价是 $i$ ，我们很容易可以想到对于每个点建一个代价为 $1$ 的到上一个点的边即可。推而广之，我们用类似的思路，引入**分层图/虚拟节点**的思想来优化建图。

对于每个点 $(r, c)$，我们引入一个“向上跳跃状态”的虚拟节点 $(r, c)'$

由此，从 $(r, c)$ 到 $(r-i, c)$ 的代价是 $1+i$ 便可以分解为：
1. 花费 1 的代价进入“向上跳模式”的虚拟节点 $(r, c)'$。
2. 在“向上跳模式”的这个虚拟图中，每向上走一步花费 1。
3. 随时可以花费 0 的代价退出“向上跳模式”的虚拟图，回到普通图。

不难得到全部连边规则：
1.  普通移动：
    -   $(r, c) \to (r, c+1)$，权值 $A_{r,c}$
    -   $(r, c) \to (r, c-1)$，权值 $A_{r,c-1}$
    -   $(r, c) \to (r+1, c)$，权值 $B_{r,c}$
2.  从普通层进入虚拟层：
    -   $(r, c) \to (r, c)'$，权值 1。
3.  在虚拟层向上：
    -   $(r, c)' \to (r-1, c)'$，权值 1。
4.  从虚拟层回到普通层：
    -   $(r, c)' \to (r, c)$，权值 0。


总节点数 $2 \times R \times C$，总边数 $O(R \times C)$。采用 $Dijkstra$ 算法的总时间复杂度为 $O(RC \log(RC))$。


```cpp
#include<bits/stdc++.h> 
using namespace std; 
#define int long long 
#define endl '\n' 
#define rep(i, f, l) for(int i(f); i <= l; ++i) 
#define per(i, f, l) for(int i(f); i >= l; --i) 
const int N = 3 * 500 * 500; 
const int M = 10 * 500 * 500; 
int a[505][505]; 
int b[505][505]; 
struct edge{ 
    int nxt; 
    int to; 
    int w; 
}; 
edge e[M]; 
struct node{ 
    int id; 
    int dis; 
    bool operator < (const node &x) const{ 
        return dis > x.dis; 
    } 
}; 
int r, c; 
int head[N]; 
bool vis[N]; 
int dis[N]; 
int cnt = 0; 
void add(int u, int v, int w){ 
    e[++cnt].to = v; 
    e[cnt].w = w; 
    e[cnt].nxt = head[u]; 
    head[u] = cnt; 
} 
priority_queue<node> q; 
void dij(int s){; 
    dis[s] = 0; 
    q.push(node{s, 0});     
    while(!q.empty()){ 
        node tmp = q.top(); 
        q.pop(); 
        int x = tmp.id; 
        if(vis[x]) continue; 
        vis[x] = 1; 
        for(int i = head[x]; i; i = e[i].nxt){ 
            int y = e[i].to; 
            if(dis[y] > dis[x] + e[i].w){ 
                dis[y] = dis[x] + e[i].w; 
                q.push((node){y, dis[y]}); 
            } 
        } 
    } 
} 

void work() { 
    cin >> r >> c; 
    rep(i, 1, r){ 
        rep(j, 1, c - 1){ 
            cin >> a[i][j]; 
        } 
    } 
    rep(i, 1, r - 1){ 
        rep(j, 1, c){ 
            cin >> b[i][j]; 
        } 
    } 
    rep(i, 1, r){ 
        rep(j, 1, c){ 
            int id = (i - 1) * c + j; 
            if(j < c) add(id, id + 1, a[i][j]); 
            if(j > 1) add(id, id - 1, a[i][j - 1]); 
            if(i < r) add(id, id + c, b[i][j]); 
            if(i > 1) add(id + r * c, id + r * c - c, 1); 
            add(id, id + r * c, 1); 
            add(id + r * c, id, 0); 
        } 
    } 
    memset(dis, 0x3f, sizeof(dis)); 
    dij(1); 
    cout << dis[r * c] << endl; 
    return; 
} 

signed main() { 
    ios::sync_with_stdio(0); 
    cin.tie(0); 
    cout.tie(0); 
    int t = 1; 
//     cin >> t; 
    while (t--) { 
        work(); 
    } 
    return 0; 
}
```

