# TODO – File Uploader Backend Polish

## General Cleanup

- [ ] Remove unused imports and console logs
- [ ] Add comments where needed
- [ ] Consistent naming

## Auth System (JWT & Refresh Tokens)

- [x] Check access token & refresh token works as expected
- [x] Ensure refresh tokens are cleared properly on logout

## Folder Management

- [x] Test CRUD operations
- [x] Edge cases: duplicate folder names, invalid IDs
- [x] Confirm folders are tied correctly to users

## File Management

- [x] Check upload works and file paths are correct
- [x] Moving files updates folder ID and paths
- [x] Deleting a file removes it from storage and DB
- [x] Test with multiple users

## Error Handling

- [ ] Check status codes (400, 401, 403, 404, 500)
- [ ] Handle database and file system errors

## Testing

- [ ] Testing all endpoints

## Documentation

- [ ] Add README.md with install/run instructions
- [ ] Add API endpoint summary
