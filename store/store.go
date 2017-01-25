package store

type DBOpts struct {
	Type string
	URL  string
}

type Store interface {
	GetUsers() ([]Users, error)
	AddUser(User) error
}

type User struct {
	Email string
}

func GetStore(opts DBOpts) Store {
	return nil
}
