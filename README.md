# Fighting-Game

If you want to play the game as is, make sure you download all the files and folders.

Left fighter hitbox is slightly larger and has a 2 frame delay compared to right fighter. Right fighter moves slightly faster as well. 

To adjust fighter fall speed, increase const gravity on line 10 of index.js

To adjust left fighter move speed, adjust player.velocity.x on line 187 and 190.

To adjust right fighter move speed, adjust enemy.velocity.x on line 207 and 210.

To change damage taken by fighters, modify onHit() property for the Fighter Class in classes.js, line 128. 
