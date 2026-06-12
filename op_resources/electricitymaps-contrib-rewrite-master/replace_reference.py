import sys
import re

# Refactor Button.tsx
file_path_button = r'web\src\components\Button.tsx'
with open(file_path_button, 'r', encoding='utf-8') as f:
    content_button = f.read()

old_button = '''    <As
      className={twMerge(
        `my-3 mx-2 flex w-fit items-center justify-center gap-x-2 rounded-full bg-white py-3 px-2 text-md font-bold shadow-[0px_0px_13px_rgb(0_0_0/12%)] transition duration-200 hover:shadow-[0px_0px_23px_rgb(0_0_0/20%)] dark:bg-gray-600 dark:hover:shadow-[0px_0px_23px_rgb(0_0_0/50%)]`,
        !isIconOnly && BUTTON_MIN_WIDTH_CLASS,
        `${disabled ? 'opacity-60 hover:shadow-[0px_0px_13px_rgb(0_0_0/12%)]' : ''}`,     
        className
      )}
      disabled={disabled}
      style={{ color: textColor, background: background }}'''

new_button = '''    <As
      className={twMerge(
        `my-3 mx-2 flex w-fit items-center justify-center gap-x-2 bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 py-3 px-4 text-[11px] font-bold uppercase tracking-[0.05em] transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200`,
        !isIconOnly && BUTTON_MIN_WIDTH_CLASS,
        `${disabled ? 'opacity-60' : ''}`,
        className
      )}
      disabled={disabled}
      style={{ color: textColor, background: background }}'''

content_button = content_button.replace(old_button, new_button)
with open(file_path_button, 'w', encoding='utf-8') as f:
    f.write(content_button)

# Refactor LeftPanel.tsx
file_path_leftpanel = r'web\src\features\panels\LeftPanel.tsx'
with open(file_path_leftpanel, 'r', encoding='utf-8') as f:
    content_leftpanel = f.read()

old_outerpanel = '''  return (
    <aside
      className={`absolute left-0 top-0 z-20 h-full w-full  bg-zinc-50 shadow-xl transition-all duration-500 dark:bg-gray-800 dark:[color-scheme:dark] sm:flex sm:w-[calc(14vw_+_16rem)] ${
        location.pathname === '/map' ? 'hidden' : ''
      } ${!isOpen ? '-translate-x-full' : ''}
`}
    >'''

new_outerpanel = '''  return (
    <aside
      className={`absolute left-0 top-0 z-20 h-full w-full bg-zinc-50 transition-all duration-500 dark:bg-zinc-950 dark:[color-scheme:dark] sm:flex sm:w-[calc(14vw_+_16rem)] ${
        location.pathname === '/map' ? 'hidden' : ''
      } ${!isOpen ? '-translate-x-full' : ''}`}
    >'''

old_collapse = '''    <button
      data-test-id="left-panel-collapse-button"
      className={
        'absolute left-full top-2 z-10 h-12 w-6 cursor-pointer  bg-zinc-50 pl-1 shadow-[6px_2px_10px_-3px_rgba(0,0,0,0.1)] hover:bg-zinc-100 dark:bg-gray-800 dark:hover:bg-gray-600'
      }
      onClick={onCollapse}
    >'''

new_collapse = '''    <button
      data-test-id="left-panel-collapse-button"
      className={
        'absolute left-full top-2 z-10 h-12 w-6 cursor-pointer bg-zinc-100 pl-1 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800'
      }
      onClick={onCollapse}
    >'''

content_leftpanel = content_leftpanel.replace(old_outerpanel, new_outerpanel)
content_leftpanel = content_leftpanel.replace(old_collapse, new_collapse)

with open(file_path_leftpanel, 'w', encoding='utf-8') as f:
    f.write(content_leftpanel)

print("Done Refactoring Reference Code Elements")
