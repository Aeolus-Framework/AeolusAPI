# Endpoints

This document is a work in progress and changes are expected.

## /simulation

```
/grid/blackouts
/grid/summary

/household/
/household/:id
/household/:id/consumption/:from/:to?
/household/:id/production/:from/:to?
/household/:id/windspeed/:from/:to?
/household/:id/picture

/market/price
/market/block/:id/:duration

/powerplant/summary
/powerplant/status
```

### sockets

```
/grid/summary
/household/:id/consumption
/household/:id/production
/powerplant/summary
```

## /Alarms

```
/list/:type
/create
```

### sockets

```
/subscribe/:type?
```

## /social

```
/chat/create
/chat/:id
/chat/:id/:userToInvite

/friend/
/friend/username/:username
/friend/email/

/user/:id
```

### sockets

```
/chat/:id/conversation
```
