import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { setWorkspace, setCurrentStrategy } from '../../redux/slices/botSlice';
import './BlocklyWorkspace.css';

const BlocklyWorkspace = () => {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!blocklyDiv.current) return;

    // Define custom blocks
    Blockly.Blocks['trade_purchase'] = {
      init: function () {
        this.appendDummyInput()
          .appendField('Purchase')
          .appendField(new Blockly.FieldDropdown([
            ['Rise', 'CALL'],
            ['Fall', 'PUT'],
            ['Matches', 'DIGITMATCH'],
            ['Differs', 'DIGITDIFF'],
            ['Even', 'DIGITEVEN'],
            ['Odd', 'DIGITODD'],
            ['Over', 'DIGITOVER'],
            ['Under', 'DIGITUNDER'],
          ]), 'CONTRACT_TYPE');
        this.appendValueInput('AMOUNT')
          .setCheck('Number')
          .appendField('Amount');
        this.appendValueInput('DURATION')
          .setCheck('Number')
          .appendField('Duration (ticks)');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('Purchase a contract');
      },
    };

    Blockly.Blocks['market_condition'] = {
      init: function () {
        this.appendDummyInput()
          .appendField('If last tick')
          .appendField(new Blockly.FieldDropdown([
            ['>', '>'],
            ['<', '<'],
            ['=', '='],
            ['>=', '>='],
            ['<=', '<='],
          ]), 'OPERATOR');
        this.appendValueInput('VALUE')
          .setCheck('Number');
        this.appendStatementInput('DO')
          .setCheck(null)
          .appendField('then');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip('Check market condition');
      },
    };

    Blockly.Blocks['get_last_tick'] = {
      init: function () {
        this.appendDummyInput()
          .appendField('Last tick price');
        this.setOutput(true, 'Number');
        this.setColour(290);
        this.setTooltip('Get the last tick price');
      },
    };

    Blockly.Blocks['wait_ticks'] = {
      init: function () {
        this.appendValueInput('TICKS')
          .setCheck('Number')
          .appendField('Wait for');
        this.appendDummyInput()
          .appendField('ticks');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip('Wait for specified number of ticks');
      },
    };

    Blockly.Blocks['bot_start'] = {
      init: function () {
        this.appendDummyInput()
          .appendField('🤖 Start Bot');
        this.appendStatementInput('STRATEGY')
          .setCheck(null)
          .appendField('Strategy');
        this.setColour(20);
        this.setTooltip('Main bot entry point');
        this.setDeletable(false);
      },
    };

    // Create workspace
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: {
        kind: 'categoryToolbox',
        contents: [
          {
            kind: 'category',
            name: 'Logic',
            colour: 210,
            contents: [
              { kind: 'block', type: 'controls_if' },
              { kind: 'block', type: 'logic_compare' },
              { kind: 'block', type: 'logic_operation' },
              { kind: 'block', type: 'logic_boolean' },
              { kind: 'block', type: 'market_condition' },
            ],
          },
          {
            kind: 'category',
            name: 'Loops',
            colour: 120,
            contents: [
              { kind: 'block', type: 'controls_repeat_ext' },
              { kind: 'block', type: 'controls_whileUntil' },
            ],
          },
          {
            kind: 'category',
            name: 'Math',
            colour: 230,
            contents: [
              { kind: 'block', type: 'math_number' },
              { kind: 'block', type: 'math_arithmetic' },
              { kind: 'block', type: 'math_single' },
            ],
          },
          {
            kind: 'category',
            name: 'Trading',
            colour: 290,
            contents: [
              { kind: 'block', type: 'bot_start' },
              { kind: 'block', type: 'trade_purchase' },
              { kind: 'block', type: 'get_last_tick' },
              { kind: 'block', type: 'wait_ticks' },
            ],
          },
          {
            kind: 'category',
            name: 'Variables',
            colour: 330,
            custom: 'VARIABLE',
          },
        ],
      },
      grid: {
        spacing: 20,
        length: 3,
        colour: '#2a2a2a',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: true,
      theme: Blockly.Theme.defineTheme('dark', {
        base: Blockly.Themes.Classic,
        componentStyles: {
          workspaceBackgroundColour: '#1a1a1a',
          toolboxBackgroundColour: '#0e0e0e',
          flyoutBackgroundColour: '#252526',
          flyoutOpacity: 0.95,
          scrollbarColour: '#666',
          scrollbarOpacity: 0.5,
        },
      }),
    });

    // Add start block by default
    const startBlock = workspace.newBlock('bot_start');
    startBlock.initSvg();
    startBlock.render();
    startBlock.moveBy(50, 50);

    workspaceRef.current = workspace;
    dispatch(setWorkspace(workspace));

    // Listen to workspace changes
    workspace.addChangeListener(() => {
      try {
        const code = javascriptGenerator.workspaceToCode(workspace);
        dispatch(setCurrentStrategy(code));
      } catch (error) {
        console.error('Error generating code:', error);
      }
    });

    return () => {
      workspace.dispose();
    };
  }, [dispatch]);

  return <div ref={blocklyDiv} className="blockly-workspace" />;
};

export default BlocklyWorkspace;