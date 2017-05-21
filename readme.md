# ACCESSING TWEEDR API

Tweedr API's built with simplicity in mind!

When a GET request is made, the request is split into one of two types.

GET requests to the index of the API returns all Tweeds submitted, sorted by Timestamp, then ID.

Posts are returned as objects within ```data```, so one may access a posts values using ```data[i].value```, where i is their target post in the array and value is one of the valid values the API uses, which can be found below.

GET requests to ```/replies/:id``` will return a tweed at a specific ID. Functionally, this will be the parameter ID + 1, as post ID 1 is unlisted and reserved for a placeholder that all brand new posts are 'replies' to, and IDs lower than 1 return errors due to how databases handle SERIAL PRIMARY KEYS. To this end, a parameter ID lower than 2 after being targetted and adding 1 to it will instead become 2, to prevent errors from checking below bounds on the table.

When checking replies, the original post is returned within ```OP```, and replies are returned as an array within ```replies```.

## Values that can be accessed are:
```
'tweed_id' - ID of the target post. Used for organization and for the reply system.

'username' - Name of user that submitted the post. Should auth0 be implemented, this would be referenced to another table as a username_id instead, but for now users simply write in a username when they submit a post.

'tweed_content' - Textual content of a tweed. In the spirit of being off-brand twitter, this is limited to 120 characters.

'tweed_timestamp' - Automatically generated timestamp for a post. There's no implemented way to edit this, so as to prevent abuse of recordkeeping mechanics.

"reply_id" - References "the tweed_id" column, noting that this post is a reply to the tweed with that particular ID. By default, this value is set to 1, noting that it is a reply to the unlisted and inaccessible placeholder post.
```

# Submitting a new post or reply

A new tweed may be submitted by sending a POST request to the index of the API. Likewise, a new reply may be submitted with a POST request to ```/reply/:id```.

As the tweed_id, tweed_timestamp, and reply_id values are automatically generated when the request is processed, only a username and tweed_content are needed.

# Editing or Deleting a post

Editing a tweed may be done via submitting a PUT request to ```/:id```

The username and tweed_content may be edited, while automatically generated values may not.

To delete a tweed, send a DELETE request to ```/:id```.