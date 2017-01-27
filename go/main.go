package main

import (
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"net/mail"
	"path/filepath"
	"regexp"
	"time"

	"github.com/faiq/bills-this-week/go/clients"
	"github.com/faiq/bills-this-week/go/store"
)

func main() {
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("../assets"))))
	http.Handle("/", http.FileServer(http.Dir("../views")))
	http.HandleFunc("/submit", func(w http.ResponseWriter, req *http.Request) {
		if req.Method != "POST" {
			w.WriteHeader(http.StatusMethodNotAllowed)
			_, _ = w.Write(nil)
			return
		}
		defer req.Body.Close()
		req.ParseForm()
		userEmail := req.PostFormValue("email")
		userZip := req.PostFormValue("zipcode")
		_, err := mail.ParseAddress(userEmail)
		if err != nil {
			w.WriteHeader(400)
			io.WriteString(w, fmt.Sprintf("this was the email you gave %s, can you check if it's right?", userEmail))
			return
		}
		re := regexp.MustCompile(`\d{5}`)
		match := re.FindStringSubmatch(userZip)
		if match == nil {
			w.WriteHeader(400)
			io.WriteString(w, fmt.Sprintf("this was the zip you gave %s, can you check if it's right?", userZip))
			return
		}
		u := store.User{
			userEmail,
			userZip,
			[]string{"nancy pelosi"},
		}
		f, err := filepath.Abs("../views/proper-response.tmpl")
		if err != nil {
			w.WriteHeader(500)
			io.WriteString(w, fmt.Sprintf("fuck\n"))
			return
		}
		house := client.NewHouseClient("http://docs.house.gov")
		_, err = house.GetBills(time.Now().Add(time.Duration(time.Now().Weekday()-7) * time.Hour * time.Duration(24)))
		if err != nil {
			w.WriteHeader(500)
			io.WriteString(w, err.Error())
			return
		}
		err = templatePage(f, u, w)
		if err != nil {
			w.WriteHeader(500)
			io.WriteString(w, err.Error())
			return
		}
		return
	})
	log.Fatal(http.ListenAndServe(":8000", nil))
}

func templatePage(templateFileName string, data store.User, w io.Writer) error {
	t, err := template.ParseFiles(templateFileName)
	if err != nil {
		return err
	}
	if err = t.Execute(w, data); err != nil {
		return err
	}
	return nil
}

func storeDecorator(opts store.DBOpts, h http.HandlerFunc) http.HandlerFunc {
	//appStore := store.GetStore(opts)
	return func(w http.ResponseWriter, req *http.Request) {
	}
}
