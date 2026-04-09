import { createAsyncThunk } from "@reduxjs/toolkit";

interface ApiError {
  message: string;
  status?: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const fetchAttributes = createAsyncThunk<
  ApiResponse<any[]>,
  void,
  { rejectValue: ApiError }
>("attributes/fetchAttributes", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/attributes");
    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue({
        message: data?.message || "Failed to fetch attributes",
        status: res.status,
      });
    }
    return data;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message || "Something went wrong",
    });
  }
});

export const createAttributeSet = createAsyncThunk<
  ApiResponse<any>,
  any,
  { rejectValue: ApiError }
>("attributes/createAttributeSet", async (payload, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/attributes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue({
        message: data?.message || "Failed to create attribute",
        status: res.status,
      });
    }
    return data;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message || "Something went wrong",
    });
  }
});

export const updateAttributeSet = createAsyncThunk<
  ApiResponse<any>,
  { id: string; payload: any },
  { rejectValue: ApiError }
>(
  "attributes/updateAttributeSet",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/attributes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue({
          message: data?.message || "Failed to update attribute",
          status: res.status,
        });
      }
      return data;
    } catch (error: any) {
      return rejectWithValue({
        message: error?.message || "Something went wrong",
      });
    }
  },
);

export const deleteAttributeSet = createAsyncThunk<
  ApiResponse<any>,
  string,
  { rejectValue: ApiError }
>("attributes/deleteAttributeSet", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/attributes/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue({
        message: data?.message || "Failed to delete attribute",
        status: res.status,
      });
    }
    return data;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message || "Something went wrong",
    });
  }
});

export const bulkImportAttributes = createAsyncThunk<
  ApiResponse<any>,
  any[],
  { rejectValue: ApiError }
>("attributes/bulkImport", async (attributes, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/attributes/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attributes),
    });
    const data = await res.json();
    if (!res.ok) {
      return rejectWithValue({
        message: data?.error || "Failed to import attributes",
        status: res.status,
      });
    }
    return data;
  } catch (error: any) {
    return rejectWithValue({
      message: error?.message || "Something went wrong",
    });
  }
});
