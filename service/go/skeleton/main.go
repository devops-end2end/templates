package main

import (
    "encoding/json"
    "log"
    "net/http"
    "os"
)

type Response struct {
    Message string `json:"message"`
    Status  string `json:"status"`
    DocsURL string `json:"docs_url"`
}

func main() {
    appName := os.Getenv("APP_NAME")
    if appName == "" {
        appName = "${{ values.component_id }}"
    }

    mux := http.NewServeMux()

    mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(Response{
            Message: "Welcome to " + appName,
            Status:  "healthy",
            DocsURL: "/docs",
        })
    })

    mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"status":"UP"}`))
    })

    log.Printf("Starting server on port 8000 for %s...", appName)
    if err := http.ListenAndServe(":8000", mux); err != nil {
        log.Fatalf("Server failed: %v", err)
    }
}