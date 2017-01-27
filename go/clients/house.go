package client

import (
	"encoding/xml"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/davecgh/go-spew/spew"
)

type HouseClient interface {
	GetBills(time.Time) ([]Bill, error)
}

type HouseAPI struct {
	BaseURL string
	client  *http.Client
}

func NewHouseClient(BaseURL string) HouseClient {
	client := &http.Client{}
	return &HouseAPI{BaseURL, client}
}

type Bill struct{}

//http://docs.house.gov/floor/Download.aspx?file=/billsthisweek/20170123/20170123.xml
func (h *HouseAPI) GetBills(date time.Time) ([]Bill, error) {
	houseDate := strings.Join(strings.Split(date.Format("2006-01-02"), "-"), "")
	qs := fmt.Sprintf("file=/billsthisweek/%s/%s.xml", houseDate, houseDate)
	u := fmt.Sprintf("%s/floor/Download.aspx?%s", h.BaseURL, qs)
	resp, err := h.client.Get(u)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var i interface{}
	if err := xml.NewDecoder(resp.Body).Decode(&i); err != nil {
		return nil, err
	}
	spew.Dump(i)
	return nil, nil
}
