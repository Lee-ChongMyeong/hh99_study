from sys import stdin
read = stdin.readline
N, M, V = map(int, read().split())

graph = [[0]*(N+1) for _ in range(N+1)]
visited = [False]*(N+1)

for _ in range(M):
  x, y = map(int, read().split())
  graph[x][y] = 1
  graph[y][x] = 1
  print(graph)

def dfs(V):
  visited[V] = True
  print(visited)
  print(V, end=" ")
  for i in range(1, N+1):
    if not visited[i] and graph[V][i] == 1:
      dfs(i)

def bfs(V):
  visited[V] = False
  queue = [V]
  while queue:
    V = queue.pop(0)
    print(V, end=" ")
    for i in range(1, N+1):
      if visited[i] and graph[V][i] == 1:
        queue.append(i)
        visited[i] = False


dfs(V)
print()
bfs(V)