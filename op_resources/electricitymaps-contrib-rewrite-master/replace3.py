import sys
import re
file_path = r'web\src\components\ToggleButton.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_1 = '''  return (
    <div className="z-10 flex h-9 rounded-full bg-zinc-100  px-[5px] py-1  drop-shadow-lg dark:bg-gray-900">
      <ToggleGroupPrimitive.Root
        className={
          'flex-start flex h-[26px] flex-grow flex-row items-center justify-between self-center rounded-full bg-gray-100 shadow-inner dark:bg-gray-700'
        }
        type="single"
        aria-label="Toggle between modes"    
        value={selectedOption}
      >
        {options.map((option, key) => (      
          <ToggleGroupPrimitive.Item
            key={`group-item-${key}`}        
            value={option.value}
            onClick={() => onToggle(option.value)}
            className={`
       inline-flex h-[26px] w-full  items-center whitespace-nowrap rounded-full px-4 ${fontSize} ${
              option.value === selectedOption
                ? ' bg-white  shadow transition duration-500 ease-in-out dark:bg-gray-500'
                : '''''

new_1 = '''  return (
    <div className="z-10 flex h-9 bg-zinc-100 px-[5px] py-1 dark:bg-zinc-900">
      <ToggleGroupPrimitive.Root
        className={
          'flex-start flex h-[26px] flex-grow flex-row items-center justify-between self-center bg-zinc-200 dark:bg-zinc-800'
        }
        type="single"
        aria-label="Toggle between modes"
        value={selectedOption}
      >
        {options.map((option, key) => (
          <ToggleGroupPrimitive.Item
            key={`group-item-${key}`}
            value={option.value}
            onClick={() => onToggle(option.value)}
            className={`
       inline-flex h-[26px] w-full items-center justify-center whitespace-nowrap px-4 font-mono font-bold uppercase tracking-wider ${fontSize} ${
              option.value === selectedOption
                ? ' bg-white transition duration-500 ease-in-out dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50'
                : ' text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'
'''

content = content.replace(old_1, new_1)

# Ensure no other rounded-full is left
content = content.replace('rounded-full', '')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done ToggleButton")