// Base padding for root level items (after project header)
export const BASE_PADDING = 8;
// Additional padding per nesting level (compact indentation)
export const LEVEL_PADDING = 8;
export const getItemPadding = (level: number, isFile: boolean) => {
    // Files need extra padding since they don't have chevron
    const fileOffset = isFile ? 12 : 0;
    return BASE_PADDING + level * LEVEL_PADDING + fileOffset;
};