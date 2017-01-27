package store

type DBOpts struct {
	Type string
	URL  string
}

type Store interface {
	GetUsers() ([]User, error)
	AddUser(User) error
}

type User struct {
	Email           string
	ZipCode         string
	Representatives []string
}

func GetStore(opts DBOpts) Store {
	return nil
}
