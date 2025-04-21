# TODO – File Uploader Backend Polish

## General Cleanup

- [ ] Remove unused imports and console logs
- [ ] Add comments where needed
- [ ] Consistent naming

## Auth System (JWT & Refresh Tokens)

- [ ] Check access token & refresh token works as expected
- [ ] Ensure refresh tokens are cleared properly on logout

## Folder Management

- [ ] Test CRUD operations
- [ ] Edge cases: duplicate folder names, invalid IDs
- [ ] Confirm folders are tied correctly to users

## File Management

- [ ] Check ppload works and file paths are correct
- [ ] Moving files updates folder ID and paths
- [ ] Deleting a file removes it from storage and DB
- [ ] Test with multiple users

## Error Handling

- [ ] Check status codes (400, 401, 403, 404, 500)
- [ ] Handle database and file system errors

## Testing

- [ ] Testing all endpoints

## Documentation

- [ ] Add README.md with install/run instructions
- [ ] Add API endpoint summary
