var React = require('react/addons');
var TreeView = require('../../src/react-bootstrap-treeview.jsx');

var data = [
    {
        text: 'Parent 1',
        id: '1',
        href: '#',
        nodes: [
            {
                text: 'Child 1',
                id: '11',
                nodes: [
                    {
                        text: 'Grandchild 1',
                        id: '111'
                    },
                    {
                        text: 'Grandchild 2',
                        id: '112'
                    }
                ]
            },
            {
                text: 'Child 2',
                id: '12'
            }
        ]
    },
    {
        text: 'Parent 2',
        id: '2'
    },
    {
        text: 'Parent 3',
        id: '3'
    },
    {
        text: 'Parent 4',
        id: '4'
    },
    {
        text: 'Parent 5'
    }
];

var test = function (evt) {

    console.log('click nodeID ' + $(evt.currentTarget).data('id'));
}

// DOM loaded
$(function () {
    React.render(
        <TreeView
            data={data}
            color={"#428bca"}
            onLineClicked={test}
            treeNodeAttributes={{'data-id': 'id'}}
            isSelectionExclusive={true}
            levels={0}
            nodeIcon= "glyphicon glyphicon-stop small"
            enableLinks={false}
            expandIcon= "glyphicon glyphicon-plus small"
            collapseIcon= "glyphicon glyphicon-minus small"
            classText="small"
            showTags={true}
            />,
        document.getElementById('treeview')
    );
})
