package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Maxiegame092/pbp-app/internal/repository"
)

type CategoryHandler struct {
	repo *repository.CategoryRepository
}

func NewCategoryHandler(repo *repository.CategoryRepository) *CategoryHandler {
	return &CategoryHandler{repo: repo}
}

// GET /categories?limit=50&offset=0
func (h *CategoryHandler) ListCategories(w http.ResponseWriter, r *http.Request) {
	limit := atoiDefault(r.URL.Query().Get("limit"), 50)
	offset := atoiDefault(r.URL.Query().Get("offset"), 0)

	data, err := h.repo.ListCategories(r.Context(), limit, offset)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]any{
			"data":  nil,
			"meta":  map[string]any{"limit": limit, "offset": offset},
			"error": "failed to fetch categories",
		})
		return
	}
	total, _ := h.repo.Count(r.Context())

	writeJSON(w, http.StatusOK, map[string]any{
		"data":  data,
		"meta":  map[string]any{"limit": limit, "offset": offset, "total": total},
		"error": nil,
	})
}

func atoiDefault(s string, def int) int {
	if s == "" {
		return def
	}
	v, err := strconv.Atoi(s)
	if err != nil {
		return def
	}
	return v
}

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}
