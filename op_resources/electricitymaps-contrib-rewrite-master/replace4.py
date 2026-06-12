import sys

file_path_search = r'web\src\features\panels\ranking-panel\SearchBar.tsx'
with open(file_path_search, 'r', encoding='utf-8') as f:
    content_search = f.read()

old_search = '''  return (
    <div className="mb-2 mr-[14px] flex h-11 flex-row items-center rounded bg-gray-100 p-3 dark:bg-slate-700">
      <HiMagnifyingGlass />
      <input
        data-test-id="zone-search-bar"       
        className="font h-8 w-full bg-inherit pl-2 text-base "
        placeholder={placeholder}
        onChange={onHandleInput}
        value={value}
      />
    </div>
  );'''

new_search = '''  return (
    <div className="mb-2 mr-[14px] flex h-11 flex-row items-center bg-zinc-100 p-3 dark:bg-zinc-900 text-zinc-500">
      <HiMagnifyingGlass />
      <input
        data-test-id="zone-search-bar"       
        className="h-8 w-full bg-transparent border-none outline-none pl-2 text-xs font-mono text-zinc-900 dark:text-zinc-50"
        placeholder={placeholder}
        onChange={onHandleInput}
        value={value}
      />
    </div>
  );'''

content_search = content_search.replace(old_search, new_search)
with open(file_path_search, 'w', encoding='utf-8') as f:
    f.write(content_search)

file_path_ranking = r'web\src\features\panels\ranking-panel\RankingPanel.tsx'
with open(file_path_ranking, 'r', encoding='utf-8') as f:
    content_ranking = f.read()

old_ranking = '''      <div className="pb-5">
        <div className="font-poppins text-lg font-medium">
          {__('left-panel.zone-list-header-title')}
        </div>
        <div className="text-sm">{__('left-panel.zone-list-header-subtitle')}</div>       
      </div>'''

new_ranking = '''      <div className="pb-5">
        <div className="text-xl font-bold tracking-[-0.01em] leading-tight text-zinc-900 dark:text-zinc-50">
          {__('left-panel.zone-list-header-title')}
        </div>
        <div className="text-xs font-mono text-zinc-500 mt-1">{__('left-panel.zone-list-header-subtitle')}</div>       
      </div>'''

content_ranking = content_ranking.replace(old_ranking, new_ranking)
with open(file_path_ranking, 'w', encoding='utf-8') as f:
    f.write(content_ranking)

print("Done Refactoring Ranking Components")
