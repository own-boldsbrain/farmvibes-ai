import sys
file_path = r'web\src\features\panels\zone\ZoneDetails.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_1 = '''  return (
    <>
      <ZoneHeader
        zoneId={zoneId}
        {...selectedData}
        isAggregated={timeAverage !== TimeAverages.HOURLY}
        isEstimated={selectedData?.estimationMethod !== undefined}
      />
      {zoneDataStatus !== ZoneDataStatus.NO_INFORMATION && <DisplayByEmissionToggle />}   
      <div className="h-[calc(100%-290px)] overflow-y-scroll p-4 pt-2 pb-40">'''

new_1 = '''  return (
    <>
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b-0 pb-4">
        <ZoneHeader
          zoneId={zoneId}
          {...selectedData}
          isAggregated={timeAverage !== TimeAverages.HOURLY}
          isEstimated={selectedData?.estimationMethod !== undefined}
        />
        {zoneDataStatus !== ZoneDataStatus.NO_INFORMATION && <DisplayByEmissionToggle />}
      </div>
      <div className="h-[calc(100%-290px)] overflow-y-scroll p-4 pt-4 pb-40 bg-zinc-50 dark:bg-zinc-950">'''

content = content.replace(old_1, new_1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done ZoneDetails")