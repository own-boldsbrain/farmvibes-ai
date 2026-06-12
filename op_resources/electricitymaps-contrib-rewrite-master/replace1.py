import sys
file_path = r'web\src\features\panels\zone\ZoneHeaderTitle.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_1 = '''                <h2
                  className="max-w-[300px] overflow-hidden truncate text-lg font-medium sm:max-w-[230px] md:max-w-[270px]"
                  data-test-id="zone-name"
                >
                  {title}
                </h2>
                {isSubZone && (
                  <p className="ml-2 flex w-auto items-center whitespace-nowrap  bg-gray-200 py-0.5 px-2  text-sm dark:bg-gray-900">
                    {countryName || zoneId}
                  </p>
                )}'''

new_1 = '''                <h2
                  className="max-w-[300px] overflow-hidden truncate text-xl font-bold tracking-[-0.01em] leading-tight text-zinc-900 dark:text-zinc-50 sm:max-w-[230px] md:max-w-[270px]"
                  data-test-id="zone-name"
                >
                  {title}
                </h2>
                {isSubZone && (
                  <p className="ml-2 flex w-auto items-center whitespace-nowrap bg-zinc-100 py-0.5 px-2 text-[11px] font-bold text-zinc-500 tracking-[0.05em] uppercase font-mono dark:bg-zinc-900">
                    {countryName || zoneId}
                  </p>
                )}'''

old_2 = '''            {disclaimer && (
              <TooltipWrapper side="bottom" tooltipContent={disclaimer}>
                <div className="mr-1 h-6 w-6 select-none  bg-white text-center drop-shadow  dark:bg-gray-900 sm:mr-0">
                  <p>i</p>
                </div>
              </TooltipWrapper>
            )}'''

new_2 = '''            {disclaimer && (
              <TooltipWrapper side="bottom" tooltipContent={disclaimer}>
                <div className="mr-1 flex h-6 w-6 items-center justify-center select-none bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 font-mono text-xs font-bold sm:mr-0">
                  <span>i</span>
                </div>
              </TooltipWrapper>
            )}'''

content = content.replace(old_1, new_1)
content = content.replace(old_2, new_2)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done ZoneHeaderTitle")
