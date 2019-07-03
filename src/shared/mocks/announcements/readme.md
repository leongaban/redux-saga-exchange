## Annoucements API requirements:

For minimize DB manipuloations and adding functionality to add specific type for several announcements - announcement has been grouped by type. This type should be unique per db table.
```c#
public enum AnnouncementType
{
    Default = 0,

    /// <summary>
    /// Main announcements will be shown for all users.
    /// </summary>
    Main = 1
}
```
## FrontOffice
**1. Get list of all announcement groups:**
 - type: GET
 - path: '/announcements'
 - parameters: none
 - respond format:
```json
{
    "data":[
        {
            "type": 1,
            "content":[
                "Announcement content 1",
                "Announcement content 2",
                "Announcement content 3",
            ]
        },
        {
            "type": 2,
            "content":[
                "Announcement content 1",
                "Announcement content 2",
                "Announcement content 3",
            ]
        }
    ]
}
```
**2. Get announcements by specific type** (looks like this EP sould be used for now with 'harcoded' type=1):
 - type: GET
 - path: '/announcements/{type}'
 - parameters: none
 - respond format:
```json
{
    "data": {
        "type": 1,
        "content":[
            "Announcement content 1",
            "Announcement content 2",
            "Announcement content 3",
        ]
    }
}
```

## BackOffice (admin panel)
**1. Get list of all announcement groups:**
 - type: GET
 - path: 'backoffice/announcements'
 - parameters: none
 - respond format:
```json
{
    "data":[
        {
            "type": 1,
            "content":[
                "Announcement content 1",
                "Announcement content 2",
                "Announcement content 3",
            ]
        },
        {
            "type": 2,
            "content":[
                "Announcement content 1",
                "Announcement content 2",
                "Announcement content 3",
            ]
        }
    ]
}
```
**2. Get announcements by specific type:**
 - type: GET
 - path: 'backoffice/announcements/{type}'
 - parameters: none
 - respond format:
```json
{
    "data": {
        "type": 1,
        "content":[
            "Announcement content 1",
            "Announcement content 2",
            "Announcement content 3",
        ]
    }
}
```
**3. Post new announcement group:**
 - type: POST
 - path: 'backoffice/announcements'
 - respond format: **Status 200**
 - body parameters:
```json
{
    "type": 1,
    "content":[
        "Announcement content 1",
        "Announcement content 2",
        "Announcement content 3",
    ]
}
```
**4. Put new announcement group** (any updates: remove one announcement, change their ordering, adding new one etc. ):
 - type: PUT
 - path: 'backoffice/announcements/{type}'
 - respond format: **Status 200**
 - body parameters:
```json
[
    "Announcement content 1",
    "Announcement content 3",
    "Announcement content 2"
]
```