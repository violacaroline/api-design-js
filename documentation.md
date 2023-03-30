# API Documentation

The documentation contains some real world example "slugs" and Id's that may or may not be valid still.

## Locations

### GET

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/locations

Gets ALL available locations

### GET{slug}

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/locations/stockholm

Gets ONE location, specified by its slug (for example /stockholm)

### POST

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/locations

Creates a new location 

### PUT{slug}

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/locations/stockholm

Completely updates a location by its slug (for example /stockholm)

### DELETE{slug}

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/locations/stockholm

Deletes a location by its slug (for example /stockholm)


## Members

### GET

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members

Gets ALL members

### GET (by location)

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/locations/stockholm/members

Gets ALL members by their location (for example stockholm)

### GET{ID}

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34

Gets ONE member, specified by its ID (for example 6425d4622e3f831e54bd9c34)

### POST

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members

Creates a new member

### PUT{ID}

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34

Completely updates a member by ID (for example /6425d4622e3f831e54bd9c34)

### PATCH{ID}

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34

Partly updates a member by its ID (for example 6425d4622e3f831e54bd9c34)

### DELETE{ID}

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34

Deletes a member by its ID (for example 6425d4622e3f831e54bd9c34)

## Farms

### GET

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34/farms

Gets ALL farms by its members ID

### GET{ID}

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34/farms/642610968825d7106f36c347

Gets ONE of a members farm, specified by its ID

### POST

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34/farms

Creates a new farm for a member

### PUT

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34/farms/6426109b8825d7106f36c34a

Completely updates a member's farm by its ID

### DELETE

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34/farms/6426109b8825d7106f36c34a

Deletes a member's farm by its ID


## Products

### GET

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34/farms/642610878825d7106f36c341/products

Gets ALL products of a specific member's farm

### GET{ID}

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34/farms/642610878825d7106f36c341/products/642612df8825d7106f36c35c

Gets ONE product of a member's farm specified by its ID

### POST

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34/farms/642610878825d7106f36c341/products

Creates a new product for a member's farm

### PUT

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34/farms/642610878825d7106f36c341/products/642613758825d7106f36c365

Completely updates a product for a member's farm

### DELETE

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/members/6425d4622e3f831e54bd9c34/farms/642610878825d7106f36c341/products/642612df8825d7106f36c35c

Deletes a product for a member's farm

## Webhooks

### POST

https://cscloud7-156.lnu.se/api-app/froot-boot/api/v1/webhooks/register

Creates/registers a new webhook

### DELETE

http://localhost:3000/api/v1/froot-boot/webhooks/unregister/6421d583751d3f31ac81132c

Deletes/unregisters a webhook