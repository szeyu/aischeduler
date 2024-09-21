import React, { useState } from 'react';
import { Tree, TreeNode as OrgTreeNode } from 'react-organizational-chart';
import Combination from './Combination';
import { ScheduleEntry } from '../models/ScheduleEntry';
import { TreeNode, createTreeFromCombinations } from '../utils/treeUtils';
import './CombinationTree.css';

const CombinationTreeNode: React.FC<{ node: TreeNode; level: number }> = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Expand first two levels by default

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <OrgTreeNode
      label={
        <div className="tree-node">
          <div className="node-content">
            <div className="node-header">
                {node.module}
                <br/>
                <span style={{ fontWeight: 'bold' }}>OCC {node.occurrence}</span>
                <br/>
                <span style={{ fontWeight: 'bold' }}>{node.activity}</span>
            </div>
            {node.combination && (
              <div className="node-combination">
                <Combination entries={node.combination} />
              </div>
            )}
            {node.children.length > 0 && (
              <button onClick={toggleExpand} className="toggle-button">
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            )}
          </div>
        </div>
      }
    >
      {isExpanded && node.children.map((child, index) => (
        <CombinationTreeNode key={index} node={child} level={level + 1} />
      ))}
    </OrgTreeNode>
  );
};

interface CombinationTreeProps {
  combinations: ScheduleEntry[][];
}

const CombinationTree: React.FC<CombinationTreeProps> = ({ combinations }) => {
  const treeData = createTreeFromCombinations(combinations);

  return (
    <div className="combination-tree">
      <Tree
        lineWidth={'2px'}
        lineColor={'#bbb'}
        lineBorderRadius={'10px'}
        label={<div className="tree-root">Combinations</div>}
      >
        {treeData.children.map((child, index) => (
          <CombinationTreeNode key={index} node={child} level={1} />
        ))}
      </Tree>
    </div>
  );
};

export default CombinationTree;