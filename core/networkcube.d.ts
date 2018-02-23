/// <reference types="jquery" />
declare module "classes/utils" {
    import { DynamicGraph } from "classes/dynamicgraph";
    import { BasicElement, Link, Node, NodePair, Location, Time } from "classes/queries";
    export function getPriorityColor(element: BasicElement): string;
    export function sortByPriority(s1: any, s2: any): number;
    export function getUrlVars(): Object;
    export function capitalizeFirstLetter(string: string): string;
    export function isValidIndex(v: number): boolean;
    export function array(value: any, size: number): any[];
    export function doubleArray(size1: number, size2?: number, value?: any): any[];
    export function isBefore(t1: Time, t2: Time): boolean;
    export function isAfter(t1: Time, t2: Time): boolean;
    export function hex2Rgb(hex: string): number[];
    export function hex2web(v: any): any;
    export function hex2RgbNormalized(hex: string): number[];
    export function getType(elements: any[]): string;
    export function areEqualShallow(a: any, b: any): boolean;
    export function compareTypesShallow(a: any, b: any): boolean;
    export function compareTypesDeep(a: any, b: any, depth: number): boolean;
    export function copyPropsShallow(source: any, target: any): any;
    export function copyTimeseriesPropsShallow(source: any, target: any): any;
    export function copyArray<TElement>(arr: any[], ctorFunc: () => TElement): TElement[];
    export function copyTimeSeries<TElement>(arr: any[], ctorFunc: () => TElement): TElement[];
    export class Box {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
        constructor(x1: number, y1: number, x2: number, y2: number);
        readonly width: number;
        readonly height: number;
        isPoint(): boolean;
    }
    export function inBox(x: any, y: any, box: Box): boolean;
    export function isSame(a: any[], b: any[]): boolean;
    export function sortNumber(a: any, b: any): number;
    export class ElementCompound {
        nodes: Node[];
        links: Link[];
        times: Time[];
        nodePairs: NodePair[];
        locations: Location[];
    }
    export class IDCompound {
        nodeIds: number[];
        linkIds: number[];
        timeIds: number[];
        nodePairIds: number[];
        locationIds: number[];
    }
    export function cloneCompound(compound: IDCompound): IDCompound;
    export function makeIdCompound(elements: ElementCompound): IDCompound;
    export function makeElementCompound(elements: IDCompound, g: DynamicGraph): ElementCompound;
    export function attributeSort(a: BasicElement, b: BasicElement, attributeName: string, asc?: boolean): number;
    export function formatAtGranularity(time: any, granualarity: number): any;
    export function arraysEqual(a: any, b: any): boolean;
    export function encapsulate(array: any[], attrName?: string): Object[];
    export function isPointInPolyArray(poly: number[][], pt: number[]): boolean;
    export function formatTimeAtGranularity(time: Time, granualarity: number): number;
    export function downloadPNGFromCanvas(name: string): void;
    export function downloadPNGfromSVG(name: string, svgId: string): void;
    export function getBlobFromSVG(name: string, svgId: string, callback?: Function): void;
    export function getBlobFromSVGNode(name: string, svgNode: any, callback: Function, backgroundColor?: string): void;
    export function getBlobFromSVGString(name: string, svgString: string, width: number, height: number, callback: Function, backgroundColor?: string): void;
    export function getSVGString(svgNode: any): string;
    export function showMessage(message: string, timeout: any): void;
}
declare module "classes/queries" {
    import { DynamicGraph, Selection } from "classes/dynamicgraph";
    import * as moment from 'moment';
    export class BasicElement {
        _id: number;
        type: string;
        g: DynamicGraph;
        constructor(id: number, type: string, dynamicGraph: DynamicGraph);
        id(): number;
        attr(attr: string): any;
        getSelections(): Selection[];
        addToSelection(b: Selection): void;
        removeFromSelection(b: any): void;
        inSelection(s: Selection): boolean;
        isSelected(selection?: Selection): boolean;
        isHighlighted(): boolean;
        isFiltered(): boolean;
        isVisible(): boolean;
        presentIn(start: Time, end?: Time): boolean;
    }
    export class Time extends BasicElement {
        constructor(id: number, dynamicGraph: DynamicGraph);
        time(): moment.Moment;
        moment(): moment.Moment;
        label(): String;
        unixTime(): number;
        links(): LinkQuery;
        year(): number;
        month(): number;
        week(): number;
        day(): number;
        hour(): number;
        minute(): number;
        second(): number;
        millisecond(): number;
        format(format: any): string;
    }
    export class Node extends BasicElement {
        constructor(id: number, graph: DynamicGraph);
        label(): string;
        nodeType(): string;
        neighbors(t1?: Time, t2?: Time): NodeQuery;
        inNeighbors(t1?: Time, t2?: Time): NodeQuery;
        outNeighbors(t1?: Time, t2?: Time): NodeQuery;
        links(t1?: Time, t2?: Time): LinkQuery;
        inLinks(t1?: Time, t2?: Time): LinkQuery;
        outLinks(t1?: Time, t2?: Time): LinkQuery;
        locations(t1?: Time, t2?: Time): LocationQuery;
        locationSerie(t1?: Time, t2?: Time): ScalarTimeSeries<Location>;
        linksBetween(n: Node): LinkQuery;
    }
    export class Link extends BasicElement {
        constructor(id: number, graph: DynamicGraph);
        linkType(): string;
        readonly source: Node;
        readonly target: Node;
        nodePair(): NodePair;
        directed(): boolean;
        other(n: Node): Node;
        weights(start?: Time, end?: Time): NumberQuery;
        presentIn(start: Time, end?: Time): boolean;
        times(): TimeQuery;
    }
    export class NodePair extends BasicElement {
        constructor(id: number, graph: DynamicGraph);
        readonly source: Node;
        readonly target: Node;
        links(): LinkQuery;
        nodeType(): string;
        presentIn(start: Time, end?: Time): boolean;
    }
    export class Location extends BasicElement {
        constructor(id: number, graph: DynamicGraph);
        label(): String;
        longitude(): number;
        latitude(): number;
        x(): number;
        y(): number;
        z(): number;
        radius(): number;
    }
    export class ScalarTimeSeries<T> {
        serie: Object;
        period(t1: Time, t2: Time): ScalarTimeSeries<T>;
        set(t: Time, element: T): void;
        get(t: Time): T;
        size(): number;
        toArray(removeDuplicates?: boolean): T[];
    }
    export class ArrayTimeSeries<T> {
        serie: Object;
        period(t1: Time, t2: Time): ArrayTimeSeries<T>;
        add(t: Time, element: T): void;
        get(t: Time): T[];
        toArray(): T[][];
        toFlatArray(removeDuplicates?: boolean): T[];
    }
    export class Query {
        _elements: number[];
        constructor(elements?: number[]);
        addUnique(element: number): void;
        add(element: number): void;
        addAll(elements: number[]): void;
        addAllUnique(elements: number[]): void;
        readonly length: number;
        size(): number;
        ids(): number[];
        removeDuplicates(): Query;
        generic_intersection(q: Query): Query;
    }
    export class NumberQuery extends Query {
        clone(): number[];
        min(): number;
        max(): number;
        mean(): number;
        sum(): number;
        toArray(): number[];
        get(index: number): number;
        forEach(f: Function): NumberQuery;
    }
    export class StringQuery {
        _elements: string[];
        constructor(elements?: string[]);
        contains(element: string): boolean;
        addUnique(element: string): void;
        add(element: string): void;
        addAll(elements: string[]): void;
        addAllUnique(elements: string[]): void;
        readonly length: number;
        size(): number;
        toArray(): string[];
        forEach(f: Function): StringQuery;
    }
    export class GraphElementQuery extends Query {
        g: DynamicGraph;
        elementType: string;
        constructor(elements: any[], g: DynamicGraph);
        generic_filter(filter: Function): any[];
        generic_selected(): any[];
        generic_visible(): any[];
        generic_highlighted(): any[];
        generic_presentIn(start: Time, end?: Time): any[];
        generic_sort(attrName: string, asc?: boolean): GraphElementQuery;
        generic_removeDuplicates(): GraphElementQuery;
    }
    export class NodeQuery extends GraphElementQuery {
        elementType: string;
        constructor(elements: any[], g: DynamicGraph);
        contains(n: Node): boolean;
        highlighted(): NodeQuery;
        visible(): NodeQuery;
        selected(): NodeQuery;
        filter(filter: Function): NodeQuery;
        presentIn(t1: Time, t2: Time): NodeQuery;
        sort(attributeName: string, asc?: boolean): NodeQuery;
        label(): StringQuery;
        neighbors(t1?: Time, t2?: Time): NodeQuery;
        links(t1?: Time, t2?: Time): LinkQuery;
        locations(t1?: Time, t2?: Time): LocationQuery;
        nodeTypes(): StringQuery;
        get(i: number): Node;
        last(): Node;
        toArray(): Node[];
        createAttribute(attrName: string, f: Function): NodeQuery;
        intersection(q: NodeQuery): NodeQuery;
        removeDuplicates(): NodeQuery;
        forEach(f: Function): NodeQuery;
    }
    export class LinkQuery extends GraphElementQuery {
        elementType: string;
        constructor(elements: any[], g: DynamicGraph);
        contains(l: Link): boolean;
        highlighted(): LinkQuery;
        visible(): LinkQuery;
        selected(): LinkQuery;
        filter(filter: Function): LinkQuery;
        presentIn(t1: Time, t2?: Time): LinkQuery;
        sort(attributeName: string): LinkQuery;
        get(i: number): Link;
        last(): Link;
        toArray(): Link[];
        weights(start?: Time, end?: Time): NumberQuery;
        createAttribute(attrName: string, f: Function): LinkQuery;
        linkTypes(): String[];
        sources(): NodeQuery;
        targets(): NodeQuery;
        intersection(q: LinkQuery): LinkQuery;
        removeDuplicates(): LinkQuery;
        forEach(f: Function): LinkQuery;
    }
    export class NodePairQuery extends GraphElementQuery {
        elementType: string;
        constructor(elements: any[], g: DynamicGraph);
        contains(n: NodePair): boolean;
        highlighted(): NodePairQuery;
        visible(): NodePairQuery;
        selected(): NodePairQuery;
        filter(filter: Function): NodePairQuery;
        presentIn(t1: Time, t2: Time): NodePairQuery;
        sort(attributeName: string): NodePairQuery;
        get(i: number): NodePair;
        last(): Link;
        toArray(): NodePair[];
        createAttribute(attrName: string, f: Function): NodePairQuery;
        intersection(q: NodePairQuery): NodePairQuery;
        removeDuplicates(): NodePairQuery;
        forEach(f: Function): NodePairQuery;
    }
    export class TimeQuery extends GraphElementQuery {
        elementType: string;
        constructor(elements: any[], g: DynamicGraph);
        contains(t: Time): boolean;
        highlighted(): TimeQuery;
        visible(): TimeQuery;
        selected(): TimeQuery;
        filter(filter: Function): TimeQuery;
        presentIn(t1: Time, t2: Time): TimeQuery;
        sort(attributeName: string): TimeQuery;
        links(): LinkQuery;
        get(i: number): Time;
        last(): Time;
        toArray(): Time[];
        createAttribute(attrName: string, f: Function): TimeQuery;
        unixTimes(): number[];
        intersection(q: TimeQuery): TimeQuery;
        forEach(f: Function): TimeQuery;
    }
    export class LocationQuery extends GraphElementQuery {
        elementType: string;
        constructor(elements: any[], g: DynamicGraph);
        contains(l: Location): boolean;
        highlighted(): LocationQuery;
        visible(): LocationQuery;
        selected(): LocationQuery;
        filter(filter: Function): LocationQuery;
        presentIn(t1: Time, t2: Time): LocationQuery;
        sort(attributeName: string): LocationQuery;
        get(i: number): Location;
        last(): Location;
        toArray(): Location[];
        createAttribute(attrName: string, f: Function): LocationQuery;
        intersection(q: LocationQuery): LocationQuery;
        removeDuplicates(): LocationQuery;
        forEach(f: Function): LocationQuery;
    }
    export class Motif {
        nodes: Node[];
        links: Link[];
        times: Time[];
        constructor(nodes: Node[], links: Link[]);
        print(): void;
    }
    export class MotifTemplate {
        nodes: number[];
        links: number[][];
        constructor(nodes: number[], links: number[][]);
    }
    export class MotifSequence {
        motifs: Motif[];
        push(m: Motif): void;
    }
}
declare module "classes/datamanager" {
    import { DynamicGraph } from "classes/dynamicgraph";
    export interface DataManagerOptions {
        keepOnlyOneSession?: boolean;
    }
    export class DataManager {
        constructor(options?: DataManagerOptions);
        setOptions(options: DataManagerOptions): void;
        dynamicGraph: DynamicGraph;
        keepOnlyOneSession: boolean;
        session: string;
        sessionDataPrefix: string;
        clearSessionData(session: string): void;
        clearAllSessionData(): void;
        isSessionCached(session: string, dataSetName: string): boolean;
        importData(session: string, data: DataSet): void;
        SEP: string;
        saveToStorage<T>(dataName: string, valueName: string, value: T, replacer?: (key: string, value: any) => any): void;
        getFromStorage<TResult>(dataName: string, valueName: string, reviver?: (key: any, value: any, state: any) => any, state?: any): TResult;
        removeFromStorage(dataName: string, valueName: string): void;
        getGraph(session: string, dataname: string): DynamicGraph;
        isSchemaWellDefined(data: DataSet): boolean;
    }
    export function getDefaultNodeSchema(): NodeSchema;
    export function getDefaultLinkSchema(): LinkSchema;
    export function getDefaultLocationSchema(): LocationSchema;
    export class DataSet {
        name: string;
        nodeTable: any[];
        linkTable: any[];
        locationTable: any[];
        nodeSchema: NodeSchema;
        linkSchema: LinkSchema;
        locationSchema: LocationSchema;
        selections: Selection[];
        timeFormat: string;
        constructor(params: any);
    }
    export class TableSchema {
        name: string;
        constructor(name: string);
    }
    export class NodeSchema extends TableSchema {
        id: number;
        label: number;
        time: number;
        location: number;
        nodeType: number;
        constructor(id: number);
    }
    export class LinkSchema extends TableSchema {
        id: number;
        source: number;
        target: number;
        weight: number;
        linkType: number;
        directed: number;
        time: number;
        constructor(id: number, source: number, target: number);
    }
    export class LocationSchema extends TableSchema {
        id: number;
        label: number;
        geoname: number;
        longitude: number;
        latitude: number;
        x: number;
        y: number;
        z: number;
        radius: number;
        constructor(id: number, label: number, geoname?: number, longitude?: number, latitude?: number, x?: number, y?: number, z?: number, radius?: number);
    }
}
declare module "classes/dynamicgraph" {
    import { BasicElement, GraphElementQuery, Link, LinkQuery, Node, NodeQuery, NodePair, NodePairQuery, Location, LocationQuery, Time, TimeQuery, ArrayTimeSeries, ScalarTimeSeries } from "classes/queries";
    import { IDCompound } from "classes/utils";
    import { DataManager, DataSet } from "classes/datamanager";
    import * as moment from 'moment';
    export var GRANULARITY: string[];
    export var DGRAPH_SUB: string;
    export var DGRAPH_SER_VERBOSE_LOGGING: boolean;
    export function dgraphReviver(dgraph: DynamicGraph, key: any, value: any): any;
    export function dgraphReplacer(key: string, value: any): any;
    export class DynamicGraph {
        BOOKMARK_COLORS: (i: number) => string;
        selectionColor_pointer: number;
        name: string;
        gran_min: number;
        gran_max: number;
        minWeight: number;
        maxWeight: number;
        _nodes: Node[];
        _links: Link[];
        _nodePairs: NodePair[];
        _locations: Location[];
        _times: Time[];
        timeObjects: any[];
        nodeOrders: Ordering[];
        matrix: number[][];
        nodeArrays: NodeArray;
        linkArrays: LinkArray;
        nodePairArrays: NodePairArray;
        timeArrays: TimeArray;
        linkTypeArrays: LinkTypeArray;
        nodeTypeArrays: NodeTypeArray;
        locationArrays: LocationArray;
        attributeArrays: Object;
        highlightArrays: IDCompound;
        currentSelection_id: number;
        defaultLinkSelection: Selection;
        defaultNodeSelection: Selection;
        selections: Selection[];
        attr(field: string, id: number, type: string): any;
        gran_min_NAME: string;
        gran_max_NAME: string;
        minWeight_NAME: string;
        maxWeight_NAME: string;
        matrix_NAME: string;
        nodeArrays_NAME: string;
        linkArrays_NAME: string;
        nodePairArrays_NAME: string;
        timeArrays_NAME: string;
        linkTypeArrays_NAME: string;
        nodeTypeArrays_NAME: string;
        locationArrays_NAME: string;
        standardArrayReplacer(key: string, value: any): any;
        static timeReviver(k: string, v: any, s: DynamicGraph): any;
        static nodeArrayReviver(k: string, v: any, s: DynamicGraph): any;
        static linkArrayReviver(k: string, v: any, s: DynamicGraph): any;
        static nodePairArrayReviver(k: string, v: any, s: DynamicGraph): any;
        static timeArrayReviver(k: string, v: any, s: DynamicGraph): any;
        static linkTypeArrayReviver(k: string, v: any, s: DynamicGraph): any;
        static nodeTypeArrayReviver(k: string, v: any, s: DynamicGraph): any;
        static locationArrayReviver(k: string, v: any, s: DynamicGraph): any;
        loadDynamicGraph(dataMgr: DataManager, dataSetName: string): void;
        saveDynamicGraph(dataMgr: DataManager): void;
        debugCompareTo(other: DynamicGraph): boolean;
        initDynamicGraph(data: DataSet): void;
        createSelections(shouldCreateArrays: boolean): void;
        private createGraphObjects(shouldCreateTimes, shouldCreateLinkTypes);
        nodeAttr(attr: string, id: number): any;
        linkAttr(attr: string, id: number): any;
        pairAttr(attr: string, id: number): any;
        timeAttr(attr: string, id: number): any;
        readonly startTime: Time;
        readonly endTime: Time;
        highlight(action: string, idCompound?: IDCompound): void;
        selection(action: string, idCompound: IDCompound, selectionId?: number): void;
        addToAttributeArraysSelection(selection: Selection, type: string, id: number): void;
        removeFromAttributeArraysSelection(selection: Selection, type: string, id: number): void;
        addElementToSelection(selection: Selection, e: BasicElement): void;
        addToSelectionByTypeAndId(selection: Selection, type: string, id: number): void;
        removeElementFromSelection(selection: Selection, e: BasicElement): void;
        removeFromSelectionByTypeAndId(selection: Selection, type: string, id: number): void;
        getSelectionsByTypeAndId(type: string, id: number): Selection[];
        filterSelection(selectionId: number, filter: boolean): void;
        isFiltered(id: number, type: string): boolean;
        isHighlighted(id: number, type: string): boolean;
        getHighlightedIds(type: string): any;
        setCurrentSelection(id: number): void;
        getCurrentSelection(): Selection;
        addSelection(id: number, color: string, acceptedType: string, priority: number): void;
        createSelection(type: string): Selection;
        deleteSelection(selectionId: number): void;
        setSelectionColor(id: number, color: string): void;
        getSelections(type?: string): Selection[];
        getSelection(id: number): Selection;
        clearSelections(): void;
        getTimeIdForUnixTime(unixTime: number): number;
        addNodeOrdering(name: string, order: number[]): void;
        setNodeOrdering(name: string, order: number[]): void;
        removeNodeOrdering(name: string, order: number[]): void;
        getNodeOrder(name: string): Ordering;
        nodes(): NodeQuery;
        links(): LinkQuery;
        times(): TimeQuery;
        locations(): LocationQuery;
        nodePairs(): NodePairQuery;
        linksBetween(n1: Node, n2: Node): LinkQuery;
        get(type: string, id: number): BasicElement;
        getAll(type: string): GraphElementQuery;
        node(id: number): Node;
        link(id: number): Link;
        time(id: number): Time;
        location(id: number): Location;
        nodePair(id: number): NodePair;
        getMinGranularity(): number;
        getMaxGranularity(): number;
    }
    export class Selection {
        name: string;
        elementIds: number[];
        acceptedType: string;
        color: string;
        id: number;
        showColor: boolean;
        filter: boolean;
        priority: number;
        constructor(id: number, acceptedType: string);
        acceptsType(type: string): boolean;
    }
    export class AttributeArray {
        id: number[];
        readonly length: number;
    }
    export class NodeArray extends AttributeArray {
        id: number[];
        label: string[];
        outLinks: ArrayTimeSeries<number>[];
        inLinks: ArrayTimeSeries<number>[];
        links: ArrayTimeSeries<number>[];
        outNeighbors: ArrayTimeSeries<number>[];
        inNeighbors: ArrayTimeSeries<number>[];
        neighbors: ArrayTimeSeries<number>[];
        selections: Selection[][];
        attributes: Object[];
        locations: ScalarTimeSeries<number>[];
        filter: boolean[];
        nodeType: string[];
    }
    export class LinkArray extends AttributeArray {
        source: number[];
        target: number[];
        linkType: string[];
        directed: boolean[];
        nodePair: number[];
        presence: number[][];
        weights: ScalarTimeSeries<any>[];
        selections: Selection[][];
        filter: boolean[];
        attributes: Object;
    }
    export class NodePairArray extends AttributeArray {
        source: number[];
        target: number[];
        links: number[][];
        selections: Selection[][];
        filter: boolean[];
    }
    export class TimeArray extends AttributeArray {
        id: number[];
        momentTime: moment.Moment[];
        label: string[];
        unixTime: number[];
        selections: Selection[][];
        filter: boolean[];
        links: number[][];
    }
    export class LinkTypeArray extends AttributeArray {
        name: string[];
        count: string[];
        color: string[];
        filter: boolean[];
    }
    export class NodeTypeArray extends AttributeArray {
        name: string[];
        count: string[];
        color: string[];
        filter: boolean[];
    }
    export class LocationArray extends AttributeArray {
        id: number[];
        label: string[];
        longitude: number[];
        latitude: number[];
        x: number[];
        y: number[];
        z: number[];
        radius: number[];
    }
    export class LinkType implements LegendElement {
        id: number;
        name: string;
        color: string;
        constructor(id: number, name: string, color: string);
    }
    export class NodeType implements LegendElement {
        id: number;
        name: string;
        color: string;
        constructor(id: number, name: string, color: string);
    }
    export interface LegendElement {
        name: string;
        color: string;
    }
    export class Ordering {
        name: string;
        order: number[];
        constructor(name: string, order: number[]);
    }
}
declare module "classes/analytics" {
    import { Motif } from "classes/queries";
    export function findDegree(nodes: Node[]): Motif[];
}
declare module "classes/colors" {
    export var schema1: string[];
    export var schema2: string[];
    export var schema3: string[];
    export var schema4: string[];
    export var schema5: string[];
    export var schema6: string[];
}
declare module "classes/main" {
    import { DataSet, DataManagerOptions } from "classes/datamanager";
    import { DynamicGraph } from "classes/dynamicgraph";
    export var TIME_FORMAT: string;
    export function timeFormat(): string;
    export function getSessionId(): string;
    export function setDataManagerOptions(options: DataManagerOptions): void;
    export function isSessionCached(session: string, dataSetName: string): boolean;
    export function importData(sessionName: string, data: DataSet): void;
    export function clearAllDataManagerSessionCaches(): void;
    export function getDynamicGraph(dataName?: string, session?: string): DynamicGraph;
    export function openVisualizationWindow(session: string, visUri: string, dataName: string): void;
    export function openVisualizationTab(session: string, visUri: string, dataName: string): void;
    export function createTabVisualizations(parentId: string, visSpec: any[], session: string, dataName: string, width: number, height: number, visParams?: any): void;
    export function switchVisTab(evt: any, visName: any): void;
    export function createVisualizationIFrame(parentId: string, visUri: string, session: string, dataName: string, width: number, height: number, visParams?: any): JQuery;
    export function getURLString(dataName: string): string;
    export enum OrderType {
        Local = 0,
        Global = 1,
        Data = 2,
    }
    export function isTrackingEnabled(): Boolean;
    export function isTrackingSet(): Boolean;
}
declare module "classes/search" {
    import { DynamicGraph } from "classes/dynamicgraph";
    import { IDCompound } from "classes/utils";
    export function searchForTerm(term: string, dgraph: DynamicGraph, type?: string): IDCompound;
    export interface IFilter {
        test(o: any): boolean;
    }
}
declare module "classes/messenger" {
    import { IDCompound, ElementCompound } from "classes/utils";
    import { Selection } from "classes/dynamicgraph";
    import { Time } from "classes/queries";
    export var MESSAGE_HIGHLIGHT: string;
    export var MESSAGE_SELECTION: string;
    export var MESSAGE_TIME_RANGE: string;
    export var MESSAGE_SELECTION_CREATE: string;
    export var MESSAGE_SELECTION_DELETE: string;
    export var MESSAGE_SELECTION_SET_CURRENT: string;
    export var MESSAGE_SELECTION_COLORING: string;
    export var MESSAGE_SELECTION_SET_COLORING_VISIBILITY: string;
    export var MESSAGE_SELECTION_FILTER: string;
    export var MESSAGE_SELECTION_PRIORITY: string;
    export var MESSAGE_SEARCH_RESULT: string;
    export function addEventListener(messageType: string, handler: Function): void;
    export function setDefaultEventListener(handler: Function): void;
    export class Message {
        id: number;
        type: string;
        body: any;
        constructor(type: string);
    }
    export function sendMessage(type: string, body: any): void;
    export function highlight(action: string, elementCompound?: ElementCompound): void;
    export class HighlightMessage extends Message {
        action: string;
        idCompound: IDCompound;
        constructor(action: string, idCompound?: IDCompound);
    }
    export function selection(action: string, compound: ElementCompound, selectionId?: number): void;
    export class SelectionMessage extends Message {
        action: string;
        selectionId: number;
        idCompound: IDCompound;
        constructor(action: string, idCompound: IDCompound, selectionId?: number);
    }
    export function timeRange(startUnix: number, endUnix: number, single: Time, propagate?: boolean): void;
    export class TimeRangeMessage extends Message {
        startUnix: number;
        endUnix: number;
        constructor(start: number, end: number);
    }
    export function createSelection(type: string, name: string): Selection;
    export class CreateSelectionMessage extends Message {
        selection: Selection;
        constructor(b: Selection);
    }
    export function setCurrentSelection(b: Selection): void;
    export class SetCurrentSelectionIdMessage extends Message {
        selectionId: number;
        constructor(b: Selection);
    }
    export function showSelectionColor(selection: Selection, showColor: boolean): void;
    export class ShowSelectionColorMessage extends Message {
        selectionId: number;
        showColor: boolean;
        constructor(selection: Selection, showColor: boolean);
    }
    export function filterSelection(selection: Selection, filter: boolean): void;
    export class FilterSelectionMessage extends Message {
        selectionId: number;
        filter: boolean;
        constructor(selection: Selection, filter: boolean);
    }
    export function swapPriority(s1: Selection, s2: Selection): void;
    export class SelectionPriorityMessage extends Message {
        selectionId1: number;
        selectionId2: number;
        priority1: number;
        priority2: number;
        filter: string;
        constructor(s1: Selection, s2: Selection, p1: number, p2: number);
    }
    export function deleteSelection(selection: Selection): void;
    export class DeleteSelectionMessage extends Message {
        selectionId: number;
        constructor(selection: Selection);
    }
    export function setSelectionColor(s: Selection, color: string): void;
    export function search(term: string, type?: string): void;
    export class SearchResultMessage extends Message {
        idCompound: IDCompound;
        searchTerm: string;
        constructor(searchTerm: string, idCompound: IDCompound);
    }
    export function distributeMessage(message: Message, ownView?: boolean): void;
}
declare module "classes/motifs" {
    import { Node, Motif, MotifTemplate } from "classes/queries";
    export function findTemplate(nodes: Node[], template: MotifTemplate, config?: Object): void;
    export function findClusters(nodes: any, config?: Object): any[];
    export function findCliques(nodes: any, config?: any): any[];
    export function findFullEgoNetwork(nodes: Node[], config?: Object): Motif[];
    export function findStars(nodes: Node[], config?: any): Motif[];
    export function findTriangles(nodes: Node[], config?: any): Motif[];
}
declare module "classes/ordering" {
    import { DynamicGraph } from "classes/dynamicgraph";
    import { Node, Link, Time } from "classes/queries";
    export function orderNodes(graph: DynamicGraph, config?: OrderingConfiguration): number[];
    export class OrderingConfiguration {
        start: Time;
        end: Time;
        nodes: Node[];
        links: Link[];
        algorithm: string[];
        distance: string[];
    }
}
declare module "helper/glutils" {
}
