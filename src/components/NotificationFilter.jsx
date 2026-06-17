import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const filters = ["All", "Placement", "Result", "Event"];

export function NotificationFilter({ value, onChange }) {
  const handleChange = (event, newValue) => {
    // Prevent unselecting the current filter entirely (newValue being null)
    if (newValue !== null && onChange) {
      onChange(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      size="small"
      sx={{ 
        flexWrap: "wrap", 
        gap: 0.5,
        border: "none",
        "& .MuiToggleButtonGroup-grouped": {
          border: "1px solid #e2e8f0",
          borderRadius: "8px !important",
          margin: "2px",
        }
      }}
    >
      {filters.map((type) => (
        <ToggleButton 
          key={type}
          value={type} 
          sx={{ 
            textTransform: "none", 
            px: 2.5,
            py: 0.75,
            fontWeight: value === type ? 700 : 500,
            fontSize: "0.875rem",
            color: "text.secondary",
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              }
            }
          }}
        >
          {type}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}