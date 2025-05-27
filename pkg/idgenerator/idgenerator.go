package idgenerator

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/oklog/ulid"
)

func GenerateId(prefix string) string {
	entropy := ulid.Monotonic(rand.New(rand.NewSource(time.Now().UnixNano())), 0)

	id, err := ulid.New(ulid.Timestamp(time.Now()), entropy)
	if err != nil {
		log.Fatal(err)
	}

	return fmt.Sprintf("%s-%s", prefix, id.String())

}
