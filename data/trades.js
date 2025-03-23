export const trades = {
    "farmer" : [
        {
            "need" : [{ item: 'wood', quantity: 1, french: 'bûche' }],
            "create" : { item: 'stick', quantity: 4, french: 'bâton' }
        },
        {
            "need" : [{ item: 'tomato', quantity: 1, french: 'tomate' }],
            "create" : { item: 'tomato_seed', quantity: 1, french: 'graine de tomate' }
        },
        {
            "need" : [{ item: 'wheat', quantity: 2, french: 'blé' }],
            "create" : { item: 'wheat_seed', quantity: 1, french: 'graine de blé' }
        }
    ],
    "blacksmith" : [
        {
            "need" : [{ item: 'wood', quantity: 2, french: 'bûche'}, { item: 'stick', quantity: 4, french: 'bâton'}],
            "create" : { item: 'wall', quantity: 4, french: 'mur' }
        },
        {
            "need" : [{ item: 'stick', quantity: 2, french: 'bâton' }],
            "create" : { item: 'parquet', quantity: 1, french: 'sol en bois' }
        },
        {
            "need" : [{ item: 'wood', quantity: 4, french: 'bûche' }, { item: 'ore', quantity: 2, french: 'minerai' }],
            "create" : { item: 'door', quantity: 1, french: 'porte' }
        },
        {
            "need" : [{ item: 'slime_bubble', quantity: 4, french: 'bulle de slime' }, { item: 'stone', quantity: 2, french: 'caillou' }],
            "create" : { item: 'desk', quantity: 1, french: 'établi' }
        }
    ]
}