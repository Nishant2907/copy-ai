import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  useGridApiContext,
  useGridSelector,
  gridPageSelector,
  gridPageCountSelector,
  gridPageSizeSelector,
} from "@mui/x-data-grid";
import { IconButton, Pagination, PaginationItem, Box } from "@mui/material";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
// } from "@/components/ui/select";
import { Select, MenuItem } from "@mui/material";

import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from 'next/link'

import {
  LoaderCircle,
  Search
} from "lucide-react";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "NAME",
    width: 250,
    renderCell: (data) => (
      <div className="flex items-center">
        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
        <span className="font-medium">{capitalizeFirstLetter(data.value)}</span>
      </div>
    ),
  },
  {
    field: "owner",
    headerName: "OWNER",
    width: 200,
    renderCell: (data) => (
      <div className="flex items-center">
        <img
          src={data.row.ownerImage} // Assuming there's an image URL in data.row.ownerImage
          alt="Owner"
          className="w-6 h-6 rounded-full mr-2"
        />
        <span className="font-medium">{data.value}</span>
      </div>
    ),
  },
  {
    field: "trigger",
    headerName: "TRIGGER",
    width: 150,
    renderCell: (data) => (
      <span className="text-gray-400">
        {data.value ? data.value : "—"}
      </span>
    ),
  },
  {
    field: "activity",
    headerName: "ACTIVITY",
    width: 150,
    renderCell: (data) => (
      <div className="text-gray-400">{data.value ? data.value : "0 runs"}</div>
    ),
  },
  {
    field: "created",
    headerName: "CREATED",
    width: 140,
    renderCell: (data) => <div className="text-gray-400">{data.value}</div>,
  },
  {
    field: "lastModified",
    headerName: "LAST MODIFIED",
    width: 140,
    renderCell: (data) => <div className="text-gray-400">{data.value}</div>,
  },
  {
    field: "actions",
    headerName: "ACTIONS",

    renderCell: () => (
      <button className="text-gray-500">
        <span>⋮</span> {/* Three dots icon */}
      </button>
    ),
  },
];

interface RowData {
  LogID: number;
  date: string;
  fileName: string;
  apolloLink: string;
  status: string;
  leadsRequested: number;
  creditsUsed: number;
}

export default function DataTable() {
  const auth = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleRowClick = (params: any) => {
    // Navigate to the workflow details page using the row's ID
    router.push(`/workflows/${params.id}`);
  };

  return (
    <div className="">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          {/* Spinning Loader */}
          <LoaderCircle className="w-8 h-8 text-purple-600 animate-spin" />
          {/* Text Descriptions */}
          <div className="text-center">
            <span className="text-gray-600 text-base block">
              Loading your Table...
            </span>
            <span className="text-gray-500 text-sm">
              Please wait while we load your data and prepare the table for you.
            </span>
          </div>
        </div>
      ) : (
        <DataGrid
          sx={{
            "&.MuiDataGrid-root": {
              border: "none !important",
            },
            '& .MuiDataGrid-cell': {
              cursor: 'pointer'
            }
          }}
          checkboxSelection={false}
          rows={rows}
          rowHeight={47} // Set custom row height
          columns={columns}
          onRowClick={handleRowClick}
          getRowId={(row) => row.id} // Specify custom id for each row
          initialState={{
            sorting: {
              sortModel: [{ field: "date", sort: "desc" }],
            },
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          // autoPageSize // Automatically adjusts page size to fit grid height
          pageSizeOptions={[10, 25]}
          getRowClassName={(params) => `border-none bg-white`} // Updated class name
          getCellClassName={(params) => `border-none `} // Updated class name
          slots={{
            pagination: CustomPagination, // Use custom pagination
            toolbar: CustomToolbar, // Use custom toolbar
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              // disableExport: true,
            },
          }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
        />
      )}
    </div>
  );
}

const CustomToolbar = () => {
  const [showInput, setShowInput] = useState(false);

  const toggleInput = () => {
    setShowInput((prev) => !prev);
  };

  return (
    <GridToolbarContainer sx={{ display: "flex", justifyContent: "flex-end" }}>
      <div className="flex items-center justify-center">
        {/* <div style={{ display: "flex", alignItems: "center" }}> */}
        <IconButton
          onClick={toggleInput}
          sx={{
            borderRadius: "15px", // Rounded-lg equivalent
            border: "1px solid #ddd", // Light border around the button
            padding: 1, // Adjust padding for consistent roundness
            transition: "background-color 0.3s ease", // Smooth hover transition
          }}
        >
          <Search className="p-1" />
        </IconButton>
        <GridToolbarQuickFilter
          sx={{
            transition: "width 0.3s ease, opacity 0.3s ease",
            width: showInput ? "300px" : "0px",
            opacity: showInput ? 1 : 0,
            padding: showInput ? "5px" : "0px",
            borderRadius: 2,
            overflow: "hidden",
            marginLeft: showInput ? "0px" : "0px",
            "& .MuiSvgIcon-root": {
              display: "none", // Removes the default search icon at the start
            },
          }}
        />
      </div>
    </GridToolbarContainer>
  );
};

// Custom Pagination Component
const CustomPagination = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector); // Current page
  const pageCount = useGridSelector(apiRef, gridPageCountSelector); // Total number of pages

  const handlePageChange = (event: any, value: number) => {
    if (value) {
      apiRef.current.setPage(value - 1); // Pagination uses 1-based indexing
    }
  };

  const handleSelectChange = (newValue: string) => {
    const newPage = parseInt(newValue, 10) - 1; // Convert value to 0-based index
    apiRef.current.setPage(newPage);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        mt: 5,
        mb: 2,
      }}
    >
      {/* Previous Button */}
      <Pagination
        count={1} // Hack to only render "previous" and "next" buttons
        page={page + 1} // 1-based index for UI
        siblingCount={0}
        boundaryCount={0}
        onChange={handlePageChange}
        renderItem={(item) => {
          if (item.type === "previous") {
            return (
              <PaginationItem
                {...item}
                onClick={() => apiRef.current.setPage(page - 1)}
                disabled={page === 0}
                sx={{
                  borderRadius: "8px",
                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
                }}
              />
            );
          }

          if (item.type === "page") {
            return (
              <div className="mx-1">
                {/* Page Selector Dropdown */}
                {/* <Select
                  value={(page + 1).toString()}
                  onValueChange={handleSelectChange} // Corrected event handler
                >
                  <SelectTrigger className="h-8 rounded-lg shadow-md px-2  py-0">
                    <p className="mx-2">{page + 1}</p>
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: pageCount }, (_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <Select
                  value={(page + 1).toString()}
                  onChange={(event) => handleSelectChange(event.target.value)} // MUI uses event.target.value
                  displayEmpty
                  className="h-8 rounded-lg shadow-md px-2 py-0 bg-white"
                >
                  {Array.from({ length: pageCount }, (_, i) => (
                    <MenuItem key={i} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            );
          }

          if (item.type === "next") {
            return (
              <>
                <PaginationItem
                  {...item}
                  onClick={() => apiRef.current.setPage(page + 1)}
                  disabled={page === pageCount - 1}
                  sx={{
                    borderRadius: "8px",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </>
            );
          }

          return null; // Skip other items
        }}
      />
    </Box>
  );
};

const rows = [
  {
    id: 1,
    name: "Sales Report Automation",
    owner: "Alice Johnson",
    ownerImage: "https://randomuser.me/api/portraits/women/45.jpg",
    trigger: "Manual",
    activity: "5 runs",
    created: "3 days ago",
    lastModified: "2 days ago",
    actions: "⋮",
  },
  {
    id: 2,
    name: "Customer Feedback Sync",
    owner: "Michael Lee",
    ownerImage: "https://randomuser.me/api/portraits/men/32.jpg",
    trigger: "Scheduled",
    activity: "12 runs",
    created: "7 days ago",
    lastModified: "5 days ago",
    actions: "⋮",
  },
  {
    id: 3,
    name: "Extract First Name",
    owner: "Sophia Martinez",
    ownerImage: "https://randomuser.me/api/portraits/women/29.jpg",
    trigger: "Manual",
    activity: "2 runs",
    created: "10 days ago",
    lastModified: "9 days ago",
    actions: "⋮",
  },
  {
    id: 4,
    name: "User Onboarding Flow",
    owner: "David Wilson",
    ownerImage: "https://randomuser.me/api/portraits/men/50.jpg",
    trigger: "Webhook",
    activity: "8 runs",
    created: "15 days ago",
    lastModified: "10 days ago",
    actions: "⋮",
  },
  {
    id: 5,
    name: "Weekly Data Backup",
    owner: "Emma Brown",
    ownerImage: "https://randomuser.me/api/portraits/women/36.jpg",
    trigger: "Scheduled",
    activity: "20 runs",
    created: "20 days ago",
    lastModified: "2 days ago",
    actions: "⋮",
  },
  {
    id: 6,
    name: "Lead Scoring Update",
    owner: "James Anderson",
    ownerImage: "https://randomuser.me/api/portraits/men/40.jpg",
    trigger: "—",
    activity: "0 runs",
    created: "26 minutes ago",
    lastModified: "26 minutes ago",
    actions: "⋮",
  },
];

