package main

import (
	"log"
	"net/http"

	"github.com/faiq/bills-this-week/store"
)

func main() {
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("./assets"))))
	http.Handle("/", http.FileServer(http.Dir("./views")))
	http.HandleFunc("/submit", http.FileServer(http.Dir("./views")))
	log.Fatal(http.ListenAndServe(":8000", nil))
}

func storeDecorator(opts store.DBOpts, h http.HandlerFunc) http.HandlerFunc {
	appStore := store.GetStore(opts)
	return func(w http.ResponseWriter, req *http.Request) {
	}
}
