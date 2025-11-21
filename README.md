# GroupCart service

The GroupCart backend service is deployed at https://groupcart-ggadhpaze4axhxhf.mexicocentral-01.azurewebsites.net/.

Service setup checklist:
- [x] API endpoints functional (first with example data)
- [x] Schema created
- [x] Service fully functional

## Schema

The database schema can be [observed here](sql/groupcart-schema.sql).

## Usage

The GroupCart service handles database management and shopping list algorithms. The client of the app should interface with the GroupCart API endpoints using `fetch()`, as in the example below:

## Example

```ts
const serviceRoot = "https://groupcart-ggadhpaze4axhxhf.mexicocentral-01.azurewebsites.net/api";

// Get data about the group with ID 0.
const res = await fetch(`${serviceRoot}/group/0`);
const groupData = await res.json();
```

## Docs

The [docs can be accessed here](https://groupcart-ggadhpaze4axhxhf.mexicocentral-01.azurewebsites.net/docs).
