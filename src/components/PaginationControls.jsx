import { Box, Pagination, MenuItem, Select, FormControl, InputLabel, Stack, Typography } from "@mui/material";

export function PaginationControls({ page, totalPages, onPageChange, limit, onLimitChange }) {
  if (totalPages <= 1 && !onLimitChange) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        mt: 4,
        mb: 2,
      }}
    >
      {onLimitChange && (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Notifications per page:
          </Typography>
          <FormControl size="small" variant="outlined" sx={{ minWidth: 80 }}>
            <Select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                "& .MuiSelect-select": { py: 0.75 },
              }}
            >
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )}

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={onPageChange}
          color="primary"
          shape="rounded"
          size="medium"
          sx={{
            "& .MuiPaginationItem-root": {
              fontWeight: 600,
              borderRadius: "8px",
            },
          }}
        />
      )}
    </Box>
  );
}
